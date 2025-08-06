const Patient = require('../models/Patient');
const User = require('../models/User');

// Listar todos los pacientes (con sus datos de usuario)
exports.getAll = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un paciente (requiere usuario existente)
exports.create = async (req, res) => {
  try {
    const { userId, contactInfo, clinicalInfo } = req.body;
    // Comprueba si ya existe paciente con ese userId
    const exists = await Patient.findOne({ where: { userId } });
    if (exists) return res.status(409).json({ message: 'Ya existe ese paciente' });
    const patient = await Patient.create({ userId, contactInfo, clinicalInfo });
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener un paciente por ID
exports.getById = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['id', 'name', 'email', 'role'] }]
    });
    if (!patient) return res.status(404).json({ message: 'No encontrado' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar un paciente
exports.update = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'No encontrado' });
    await patient.update(req.body);
    res.json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrado lógico
exports.delete = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) return res.status(404).json({ message: 'No encontrado' });
    await patient.destroy();
    res.json({ message: 'Paciente eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
