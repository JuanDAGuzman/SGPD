const LabResult = require('../models/LabResult');

exports.getAll = async (req, res) => {
  try {
    const { patientId } = req.query;
    const where = {};
    if (patientId) where.patientId = patientId;

    const results = await LabResult.findAll({ where });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { patientId, date, description, resultFile } = req.body;
    const lab = await LabResult.create({ patientId, date, description, resultFile });
    res.status(201).json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const lab = await LabResult.findByPk(req.params.id);
    if (!lab) return res.status(404).json({ message: 'No encontrado' });
    await lab.update(req.body);
    res.json(lab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const lab = await LabResult.findByPk(req.params.id);
    if (!lab) return res.status(404).json({ message: 'No encontrado' });
    await lab.destroy();
    res.json({ message: 'Resultado eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
