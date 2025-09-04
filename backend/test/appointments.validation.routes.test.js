const express = require("express");
const request = require("supertest");
const { body, validationResult } = require("express-validator");


jest.mock("nanoid", () => ({ nanoid: () => "MOCKID" }), { virtual: true });

jest.mock("../src/models", () => ({
  Appointment: { create: jest.fn() },
  AppointmentRequest: { findByPk: jest.fn() }, 
}), { virtual: true });
const db = require("../src/models");

jest.mock("../src/utils/mailer", () => ({
  sendTestMail: jest.fn().mockResolvedValue(true),
}), { virtual: true });

jest.mock("../src/middlewares/auth", () => ({
  authenticate: (req, res, next) => { req.user = { id: 3, role: "doctor" }; next(); },
  authorize: () => (req, res, next) => next(),
}), { virtual: true });


const createAppointmentCtrl = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  // Simula la creación
  const payload = req.body;
  const created = { id: 1, ...payload, meetingLink: payload.type === "virtual" ? "https://meet.jit.si/ConsultaMedica-3-5" : null };
  db.Appointment.create.mockResolvedValue(created);
  const out = await db.Appointment.create(payload);
  return res.status(201).json(out);
};

const rules = [
  body("patientId").isInt().withMessage("El paciente es obligatorio"),
  body("doctorId").isInt().withMessage("El doctor es obligatorio"),
  body("date").notEmpty().withMessage("La fecha es obligatoria").isISO8601().withMessage("Fecha inválida"),
  body("type").isIn(["presencial", "virtual"]).withMessage("El tipo de cita debe ser presencial o virtual"),
  body("location").if(body("type").equals("presencial")).notEmpty().withMessage("El lugar es obligatorio para citas presenciales"),
  body("room").if(body("type").equals("presencial")).notEmpty().withMessage("El consultorio es obligatorio para citas presenciales"),
];

function makeApp() {
  const app = express();
  app.use(express.json());
  const { authenticate, authorize } = require("../src/middlewares/auth");
  app.post("/api/appointments", authenticate, authorize("doctor"), rules, createAppointmentCtrl);
  return app;
}

describe("Validaciones POST /api/appointments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rechaza falta de campos obligatorios", async () => {
    const app = makeApp();
    const res = await request(app).post("/api/appointments").send({});
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    const fields = res.body.errors.map(e => e.path);
    expect(fields).toEqual(expect.arrayContaining(["patientId", "doctorId", "date", "type"]));
  });

  it("rechaza cita presencial sin location/room", async () => {
    const app = makeApp();
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "2025-08-20T15:00:00.000Z",
      type: "presencial",
      // faltan location y room
    };
    const res = await request(app).post("/api/appointments").send(payload);
    expect(res.status).toBe(400);
    const msgs = res.body.errors.map(e => e.msg);
    expect(msgs).toEqual(expect.arrayContaining([
      "El lugar es obligatorio para citas presenciales",
      "El consultorio es obligatorio para citas presenciales",
    ]));
  });

  it("acepta cita virtual mínima", async () => {
    const app = makeApp();
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "2025-08-20T15:00:00",
      type: "virtual",
      notes: "Consulta virtual de seguimiento",
    };
    const res = await request(app).post("/api/appointments").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ type: "virtual", patientId: 5, doctorId: 3 });
  });

  it("rechaza fecha inválida", async () => {
    const app = makeApp();
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "no-es-iso",
      type: "virtual",
    };
    const res = await request(app).post("/api/appointments").send(payload);
    expect(res.status).toBe(400);
    const msg = res.body.errors.find(e => e.path === "date")?.msg;
    expect(msg).toBe("Fecha inválida");
  });
});
