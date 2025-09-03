const PatientTreatment = require("../models/PatientTreatment");
const Patient = require("../models/Patient");
const Treatment = require("../models/Treatment");
const Doctor = require("../models/Doctor");

// Listar todos los tratamientos asignados a un paciente
exports.getAll = async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;

    const patientTreatments = await PatientTreatment.findAll({
      where,
      include: [{ model: Treatment }, { model: Doctor }],
    });
    res.json(patientTreatments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Asignar tratamiento a paciente
exports.create = async (req, res) => {
  try {
    const {
      patientId,
      treatmentId,
      prescribedBy,
      startDate,
      endDate,
      status,
      notes,
    } = req.body;
    const pt = await PatientTreatment.create({
      patientId,
      treatmentId,
      prescribedBy,
      startDate,
      endDate,
      status,
      notes,
    });
    res.status(201).json(pt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar tratamiento asignado
exports.update = async (req, res) => {
  try {
    const pt = await PatientTreatment.findByPk(req.params.id);
    if (!pt) return res.status(404).json({ message: "No encontrado" });
    await pt.update(req.body);
    res.json(pt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar (borrado lógico)
exports.delete = async (req, res) => {
  try {
    const pt = await PatientTreatment.findByPk(req.params.id);
    if (!pt) return res.status(404).json({ message: "No encontrado" });
    await pt.destroy();
    res.json({ message: "Tratamiento desasignado (lógico)" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
