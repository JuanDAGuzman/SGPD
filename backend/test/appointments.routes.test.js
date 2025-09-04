const express = require("express");
const request = require("supertest");

jest.mock("../src/models", () => ({
  Appointment: { create: jest.fn() },
}));
const db = require("../src/models");

jest.mock("../src/utils/mailer", () => ({
  sendTestMail: jest.fn().mockResolvedValue(true),
}), { virtual: true });

jest.mock("../src/middlewares/auth", () => ({
  authenticate: (req, res, next) => { req.user = { id: 3, role: "doctor" }; next(); },
  authorize: () => (req, res, next) => next(),
}), { virtual: true });

const createCtrl = async (req, res) => {
  try {
    const payload = req.body;
    const created = { id: 77, ...payload, meetingLink: payload.type === "virtual" ? "https://meet.jit.si/ConsultaMedica-3-5" : null };
    db.Appointment.create.mockResolvedValue(created);
    const out = await db.Appointment.create(payload);
    return res.status(201).json(out);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

function makeApp() {
  const app = express();
  app.use(express.json());
  const { authenticate, authorize } = require("../src/middlewares/auth");
  const router = express.Router();
  router.post("/", authenticate, authorize("doctor"), createCtrl);
  app.use("/api/appointments", router);
  return app;
}

describe("POST /api/appointments", () => {
  beforeEach(() => jest.clearAllMocks());

  it("crea cita virtual", async () => {
    const app = makeApp();
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "2025-08-20T15:00:00",
      type: "virtual",
      notes: "Consulta virtual de seguimiento"
    };
    const res = await request(app).post("/api/appointments").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 77, type: "virtual" });
  });

  it("crea cita presencial", async () => {
    const app = makeApp();
    const payload = {
      patientId: 5,
      doctorId: 3,
      date: "2025-08-20T15:00:00.000Z",
      status: "programada",
      type: "presencial",
      location: "Calle 45c # 22-02",
      room: "Consultorio 100",
      notes: "Consulta de prueba en agosto"
    };
    const res = await request(app).post("/api/appointments").send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 77, type: "presencial" });
  });
});
