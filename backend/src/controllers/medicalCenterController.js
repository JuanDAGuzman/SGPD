const MedicalCenter = require('../models/MedicalCenter');

exports.create = async (req, res) => {
  try {
    const { name, type, address, city, department, phone, email, regime } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del centro es obligatorio' });
    }

    const center = await MedicalCenter.create({
      name,
      type,
      address,
      city,
      department,
      phone,
      email,
      regime
    });

    res.status(201).json({
      message: 'Centro de salud registrado exitosamente',
      center
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

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
