const Doctor = require('../models/Doctor');
const User = require('../models/User');
const MedicalCenter = require('../models/MedicalCenter');

// Crear doctor (asociando userId y medicalCenterId)
exports.create = async (req, res) => {
  try {
    const { userId, specialty, medicalCenterId } = req.body;
    // Verifica si el usuario existe y tiene rol doctor
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'doctor') return res.status(400).json({ message: 'Usuario inválido' });
    // Verifica si ya existe doctor
    const exists = await Doctor.findOne({ where: { userId } });
    if (exists) return res.status(409).json({ message: 'Doctor ya existe' });
    const doctor = await Doctor.create({ userId, specialty, medicalCenterId });
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos los doctores (con usuario y centro médico)
exports.getAll = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email', 'role'] },
        { model: MedicalCenter, attributes: ['id', 'name', 'address'] }
      ]
    });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Actualizar doctor
exports.update = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'No encontrado' });
    await doctor.update(req.body);
    res.json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrado lógico de doctor
exports.delete = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'No encontrado' });
    await doctor.destroy();
    res.json({ message: 'Doctor eliminado (lógico)' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
