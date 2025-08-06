const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');

// Reporte: Citas por estado
router.get('/citas-por-estado', authenticate, authorize('admin'), ctrl.citasPorEstado);

// Reporte: Pacientes nuevos por mes
router.get('/pacientes-por-mes', authenticate, authorize('admin'), ctrl.pacientesPorMes);

// Reporte: Tratamientos más utilizados
router.get('/tratamientos-mas-usados', authenticate, authorize('admin'), ctrl.tratamientosMasUsados);

module.exports = router;
