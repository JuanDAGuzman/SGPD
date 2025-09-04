const db = require("../models");
const { AppointmentRequest } = require("../models");

exports.createRequest = async (req, res) => {
  try {
    const { message, preferredDate } = req.body;
    const user = req.user;

    const patient = await db.Patient.findOne({ where: { userId: user.id } });
    if (!patient)
      return res.status(400).json({ error: "Paciente no encontrado" });

    const appointmentRequest = await db.AppointmentRequest.create({
      patientId: patient.id,
      message,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
    });

    res.status(201).json(appointmentRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.list = async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;

    const requests = await db.AppointmentRequest.findAll({ where });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await db.AppointmentRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    request.status = status || request.status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
