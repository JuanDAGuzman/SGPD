const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/treatmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin', 'doctor'), ctrl.getAll);
router.post('/', authenticate, authorize('admin', 'doctor'), ctrl.create);
router.put('/:id', authenticate, authorize('admin', 'doctor'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.delete);

module.exports = router;
