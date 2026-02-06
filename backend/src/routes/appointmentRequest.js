const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentRequestController");
const { authenticate, authorize } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/appointment-requests:
 *   post:
 *     summary: Crear una solicitud de cita (paciente)
 *     tags: [Solicitudes de Cita]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: Motivo de la consulta
 *               preferredDate:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha preferida para la cita
 *               specialty:
 *                 type: string
 *                 description: Especialidad requerida
 *               type:
 *                 type: string
 *                 enum: [presencial, virtual]
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente
 *       409:
 *         description: Ya existe una solicitud pendiente
 */
router.post(
  "/",
  authenticate,
  authorize("patient"),
  [
    body("message").notEmpty().withMessage("El motivo de la consulta es obligatorio"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  ctrl.createRequest
);

/**
 * @swagger
 * /api/appointment-requests:
 *   get:
 *     summary: Listar solicitudes de citas
 *     tags: [Solicitudes de Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, aceptada, rechazada]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "doctor", "patient"),
  ctrl.list
);

/**
 * @swagger
 * /api/appointment-requests/{id}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     tags: [Solicitudes de Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "doctor", "patient"),
  ctrl.getById
);

/**
 * @swagger
 * /api/appointment-requests/{id}:
 *   put:
 *     summary: Actualizar estado de solicitud (doctor/admin)
 *     tags: [Solicitudes de Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, aceptada, rechazada]
 *               rejectionReason:
 *                 type: string
 *               assignedDoctorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Solicitud actualizada
 *       404:
 *         description: Solicitud no encontrada
 */
router.put(
  "/:id",
  authenticate,
  authorize("doctor", "admin"),
  ctrl.updateStatus
);

/**
 * @swagger
 * /api/appointment-requests/{id}:
 *   delete:
 *     summary: Cancelar solicitud de cita
 *     tags: [Solicitudes de Cita]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud cancelada
 *       404:
 *         description: Solicitud no encontrada
 */
router.delete(
  "/:id",
  authenticate,
  authorize("patient", "admin"),
  ctrl.cancelRequest
);

module.exports = router;
