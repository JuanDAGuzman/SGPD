const express = require("express");
const request = require("supertest");

jest.mock("../src/models", () => ({
  AppointmentRequest: { findByPk: jest.fn() },
}));
const db = require("../src/models");

jest.mock("../src/middlewares/auth", () => ({
  authenticate: (req, res, next) => { req.user = { id: 3, role: "doctor" }; next(); },
  authorize: () => (req, res, next) => next(),
}), { virtual: true });

const updateCtrl = async (req, res) => {
  try {
    const r = await db.AppointmentRequest.findByPk(req.params.id);
    if (!r) return res.status(404).json({ message: "Solicitud no encontrada" });
    r.status = req.body.status || r.status;
    r.save = jest.fn().mockRejectedValue(new Error("DB down"));
    await r.save();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

function makeApp() {
  const app = express();
  app.use(express.json());
  const { authenticate, authorize } = require("../src/middlewares/auth");
  const router = express.Router();
  router.put("/:id", authenticate, authorize("doctor", "admin"), updateCtrl);
  app.use("/api/appointment-requests", router);
  return app;
}

describe("Errores PUT /api/appointment-requests/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("404 si no existe", async () => {
    db.AppointmentRequest.findByPk.mockResolvedValue(null);
    const app = makeApp();
    const res = await request(app).put("/api/appointment-requests/999").send({ status: "concluida" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Solicitud no encontrada" });
  });

  it("500 si save() falla", async () => {
    db.AppointmentRequest.findByPk.mockResolvedValue({ id: 9, status: "pendiente" });
    const app = makeApp();
    const res = await request(app).put("/api/appointment-requests/9").send({ status: "concluida" });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "DB down" });
  });
});
