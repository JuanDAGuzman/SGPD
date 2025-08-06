const Treatment = require('../models/Treatment');

exports.getAll = async (req, res) => {
  try {
    const treatments = await Treatment.findAll();
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    const treatment = await Treatment.create({ name, description, active });
    res.status(201).json(treatment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'No encontrado' });
    await treatment.update(req.body);
    res.json(treatment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'No encontrado' });
    await treatment.destroy();
    res.json({ message: 'Tratamiento eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
