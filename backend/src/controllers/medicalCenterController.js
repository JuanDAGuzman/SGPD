const MedicalCenter = require('../models/MedicalCenter');

// Crear un centro médico
exports.create = async (req, res) => {
  try {
    const { name, address } = req.body;
    const center = await MedicalCenter.create({ name, address });
    res.status(201).json(center);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos los centros médicos
exports.getAll = async (req, res) => {
  try {
    const centers = await MedicalCenter.findAll();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const center = await MedicalCenter.findByPk(req.params.id);
    if (!center) return res.status(404).json({ message: 'No encontrado' });
    await center.update(req.body);
    res.json(center);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrado lógico de centro médico
exports.delete = async (req, res) => {
  try {
    const center = await MedicalCenter.findByPk(req.params.id);
    if (!center) return res.status(404).json({ message: 'No encontrado' });
    await center.destroy();
    res.json({ message: 'Centro médico eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
