const MedicalHistory = require('../models/MedicalHistory');
const Patient = require('../models/Patient');

exports.getAll = async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;

    const history = await MedicalHistory.findAll({ where });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { patientId, diagnosis, notes } = req.body;
    const record = await MedicalHistory.create({ patientId, diagnosis, notes });
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const record = await MedicalHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'No encontrado' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const record = await MedicalHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'No encontrado' });
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const record = await MedicalHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'No encontrado' });
    await record.destroy();
    res.json({ message: 'Registro eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
