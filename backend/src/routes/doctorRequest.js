const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/doctorRequestController');
const { authenticate, authorize } = require('../middleware/auth');

// Paciente solicita ser doctor
router.post('/request', authenticate, authorize('patient'), ctrl.requestDoctor);

// Admin procesa solicitud
router.post('/process/:id', authenticate, authorize('admin'), ctrl.processRequest);

// Admin ve todas las solicitudes
router.get('/', authenticate, authorize('admin'), ctrl.getAll);

module.exports = router;
