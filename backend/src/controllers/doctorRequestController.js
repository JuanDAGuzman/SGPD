const DoctorRequest = require('../models/DoctorRequest');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Paciente solicita cambio a doctor
exports.requestDoctor = async (req, res) => {
  try {
    const { cardNumber, documents } = req.body;
    // El userId lo sacas del JWT
    const userId = req.user.id;
    const existing = await DoctorRequest.findOne({ where: { userId, status: 'pendiente' } });
    if (existing) return res.status(400).json({ message: 'Ya tienes una solicitud pendiente' });
    const request = await DoctorRequest.create({ userId, cardNumber, documents });
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin aprueba/rechaza solicitud
exports.processRequest = async (req, res) => {
  try {
    const { status, reason, specialty, medicalCenterId } = req.body;
    const request = await DoctorRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });

    if (status === 'aprobado') {
      // Cambia rol en tabla User
      const user = await User.findByPk(request.userId);
      await user.update({ role: 'doctor' });
      // Crea el registro en Doctors (puedes solicitar datos extra aquí)
      await Doctor.create({ userId: user.id, specialty, medicalCenterId });
    }

    await request.update({ status, reason });
    res.json({ message: `Solicitud ${status}` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar solicitudes (solo admin)
exports.getAll = async (req, res) => {
  const requests = await DoctorRequest.findAll({ include: [User] });
  res.json(requests);
};
