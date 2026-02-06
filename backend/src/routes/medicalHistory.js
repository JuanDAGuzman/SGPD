const express = require('express');
const router = express.Router();
const medicalHistoryController = require('../controllers/medicalHistoryController');
const { authenticate, authorize } = require('../middleware/auth');

// Rutas
// Crear: solo doctores o admin
router.post('/', authenticate, authorize('doctor', 'admin'), medicalHistoryController.create);

// Obtener por paciente: pacientes (el suyo propio), doctores y admins
router.get('/', authenticate, authorize('patient', 'doctor', 'admin'), medicalHistoryController.getByPatient);

// Obtener por ID: igual
// Obtener stats
router.get('/stats', authenticate, authorize('patient', 'doctor', 'admin'), medicalHistoryController.getPatientStats);
router.get('/active-treatments', authenticate, authorize('patient', 'doctor'), medicalHistoryController.getActiveTreatments);
router.get('/:id', authenticate, authorize('patient', 'doctor', 'admin'), medicalHistoryController.getById);

module.exports = router;
