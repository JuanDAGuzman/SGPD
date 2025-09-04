const express = require("express");
const request = require("supertest");

jest.mock("../src/models", () => ({
  Patient: { findOne: jest.fn() },
  AppointmentRequest: { create: jest.fn() },
}));
const db = require("../src/models");

jest.mock("../src/middlewares/auth", () => ({
  authenticate: (req, res, next) => {
    req.user = { id: 7, role: "patient" };
    next();
  },
  authorize: () => (req, res, next) => next(),
}), { virtual: true });

const ctrl = require("../src/controllers/appointmentRequestController");
const { authenticate, authorize } = require("../src/middlewares/auth");

function makeApp() {
  const app = express();
  app.use(express.json());
  const router = express.Router();
  router.post("/", authenticate, authorize("patient"), ctrl.createRequest);
  app.use("/api/appointment-requests", router);
  return app;
}

describe("POST /api/appointment-requests", () => {
  beforeEach(() => jest.clearAllMocks());

  it("crea la solicitud cuando el paciente existe", async () => {
    db.Patient.findOne.mockResolvedValue({ id: 5, userId: 7 });
    db.AppointmentRequest.create.mockResolvedValue({
      id: 123,
      patientId: 5,
      message: "Necesito cita",
      preferredDate: "2025-08-20T15:00:00.000Z",
    });

    const app = makeApp();
    const res = await request(app)
      .post("/api/appointment-requests")
      .send({ message: "Necesito cita", preferredDate: "2025-08-20T15:00:00.000Z" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 123, patientId: 5 });
    expect(db.Patient.findOne).toHaveBeenCalledWith({ where: { userId: 7 } });
    expect(db.AppointmentRequest.create).toHaveBeenCalled();
  });

  it("devuelve 400 si el paciente no existe", async () => {
    db.Patient.findOne.mockResolvedValue(null);

    const app = makeApp();
    const res = await request(app)
      .post("/api/appointment-requests")
      .send({ message: "x" });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Paciente no encontrado" });
  });
});
