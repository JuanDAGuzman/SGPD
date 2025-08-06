const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patientTreatmentController');
const { authenticate, authorize } = require('../middleware/auth');

// Solo admin y doctor pueden asignar tratamientos
router.get('/', authenticate, authorize('admin', 'doctor'), ctrl.getAll);
router.post('/', authenticate, authorize('admin', 'doctor'), ctrl.create);
router.put('/:id', authenticate, authorize('admin', 'doctor'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin', 'doctor'), ctrl.delete);

module.exports = router;
