const { Patient } = require("../models");

const User = require("../models/User");

exports.getAll = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { userId, contactInfo, clinicalInfo } = req.body;
    const exists = await Patient.findOne({ where: { userId } });
    if (exists)
      return res.status(409).json({ message: "Ya existe ese paciente" });
    const patient = await Patient.create({ userId, contactInfo, clinicalInfo });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await Patient.findOne({
      where: { userId },
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
    });
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    if (req.user.role === "paciente" && req.user.id !== patient.userId) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByPatientId = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: { id },
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
    });
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      const patient = await Patient.findByPk(req.params.id);
      if (!patient || patient.userId !== req.user.id) {
        return res.status(403).json({ error: "No autorizado" });
      }
    }
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: "No encontrado" });
    await patient.update(req.body);
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: "No encontrado" });
    await patient.destroy();
    res.json({ message: "Paciente eliminado (lógico)" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
