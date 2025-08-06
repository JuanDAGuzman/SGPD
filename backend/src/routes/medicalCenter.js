const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/medicalCenterController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin'), ctrl.create);
router.get('/', authenticate, authorize('admin', 'doctor'), ctrl.getAll);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.delete);


module.exports = router;
