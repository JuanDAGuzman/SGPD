const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/stats/dashboard - Obtener estadísticas del dashboard
router.get('/dashboard', authenticate, authorize('admin'), statsController.getDashboardStats);

// GET /api/stats/recent-activity - Obtener actividad reciente
router.get('/recent-activity', authenticate, authorize('admin'), statsController.getRecentActivity);

// GET /api/stats/doctor-dashboard - Obtener estadísticas del dashboard del doctor
router.get('/doctor-dashboard', authenticate, authorize('doctor'), statsController.getDoctorDashboardStats);

module.exports = router;
