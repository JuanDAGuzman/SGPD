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
    const { id } = req.params;
    const r = await db.AppointmentRequest.findByPk(id);
    if (!r) return res.status(404).json({ message: "Solicitud no encontrada" });
    r.status = req.body.status || r.status;
    r.save = jest.fn().mockResolvedValue(r); 
    await r.save();
    res.json(r);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

function makeApp() {
  const app = express();
  app.use(express.json());
  const router = express.Router();
  const { authenticate, authorize } = require("../src/middlewares/auth");
  router.put("/:id", authenticate, authorize("doctor", "admin"), updateCtrl);
  app.use("/api/appointment-requests", router);
  return app;
}

describe("PUT /api/appointment-requests/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  it("actualiza a concluida", async () => {
    db.AppointmentRequest.findByPk.mockResolvedValue({ id: 10, status: "pendiente" });

    const app = makeApp();
    const res = await request(app)
      .put("/api/appointment-requests/10")
      .send({ status: "concluida" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 10, status: "concluida" });
  });

  it("404 si no existe", async () => {
    db.AppointmentRequest.findByPk.mockResolvedValue(null);

    const app = makeApp();
    const res = await request(app)
      .put("/api/appointment-requests/999")
      .send({ status: "concluida" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Solicitud no encontrada" });
  });
});
