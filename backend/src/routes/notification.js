const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/notifications - Obtener todas las notificaciones
router.get('/', authenticate, authorize('admin'), notificationController.getAll);

// GET /api/notifications/:id - Obtener una notificación por ID
router.get('/:id', authenticate, authorize('admin'), notificationController.getById);

// POST /api/notifications - Crear una nueva notificación
router.post('/', authenticate, authorize('admin'), notificationController.create);

// PUT /api/notifications/:id - Actualizar una notificación
router.put('/:id', authenticate, authorize('admin'), notificationController.update);

// PUT /api/notifications/:id/mark-as-read - Marcar como leída
router.put('/:id/mark-as-read', authenticate, authorize('admin'), notificationController.markAsRead);

// DELETE /api/notifications/:id - Eliminar una notificación
router.delete('/:id', authenticate, authorize('admin'), notificationController.delete);

module.exports = router;
