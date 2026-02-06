const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users - Obtener todos los usuarios (solo admin)
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);

// GET /api/users/:id - Obtener un usuario por ID (solo admin)
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);

// PUT /api/users/:id - Actualizar un usuario (solo admin)
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);

// DELETE /api/users/:id - Eliminar un usuario (solo admin)
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// PUT /api/users/:id/change-password - Cambiar contraseña (solo admin)
router.put('/:id/change-password', authenticate, authorize('admin'), userController.changePassword);

module.exports = router;
