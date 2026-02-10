const express = require('express');
const router = express.Router();
const controller = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/pending-users', authenticate, authorize('admin'), controller.getPendingUsers);
router.put('/users/:id/status', authenticate, authorize('admin'), controller.updateUserStatus);

module.exports = router;
