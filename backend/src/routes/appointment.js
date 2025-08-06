const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointmentController");
const { authenticate, authorize } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const { sendTestMail } = require("../utils/mailer");

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar todas las citas
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 */

router.get(
  "/",
  authenticate,
  authorize("admin", "doctor", "patient"),
  ctrl.getAll
);
/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Obtener cita por ID
 *     tags: [Citas]
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
 *         description: Cita encontrada
 *       404:
 *         description: Cita no encontrada
 */

router.get(
  "/:id",
  authenticate,
  authorize("admin", "doctor", "patient"),
  ctrl.getById
);
/**
 * @swagger
 * /api/appointments/{id}:
 *   put:
 *     summary: Actualizar cita por ID
 *     tags: [Citas]
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
 *               date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [programada, finalizada, cancelada, reprogramada, no_asistio, en_atencion]
 *               notes:
 *                 type: string
 *               location:
 *                 type: string
 *               room:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cita actualizada
 *       404:
 *         description: Cita no encontrada
 */
router.put("/:id", authenticate, authorize("admin", "doctor"), ctrl.update);
/**
 * @swagger
 * /api/appointments/{id}:
 *   delete:
 *     summary: Eliminar cita por ID (borrado lógico)
 *     tags: [Citas]
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
 *         description: Cita eliminada
 *       404:
 *         description: Cita no encontrada
 */
router.delete("/:id", authenticate, authorize("admin", "doctor"), ctrl.delete);
router.post(
  "/finish-all",
  authenticate,
  authorize("admin", "doctor"),
  ctrl.finishAllByPatient
);
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Crear una nueva cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date-time
 *               type:
 *                 type: string
 *                 enum: [presencial, virtual]
 *               location:
 *                 type: string
 *               room:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       409:
 *         description: Conflicto de horario o cita pendiente
 */

router.post(
  "/",
  authenticate,
  authorize("admin", "doctor"),
  [
    body("patientId").isInt().withMessage("El paciente es obligatorio"),
    body("doctorId").isInt().withMessage("El doctor es obligatorio"),
    body("date")
      .notEmpty()
      .withMessage("La fecha es obligatoria")
      .isISO8601()
      .withMessage("Fecha inválida"),
    body("type")
      .isIn(["presencial", "virtual"])
      .withMessage("El tipo de cita debe ser presencial o virtual"),
    body("location")
      .if(body("type").equals("presencial"))
      .notEmpty()
      .withMessage("El lugar es obligatorio para citas presenciales"),
    body("room")
      .if(body("type").equals("presencial"))
      .notEmpty()
      .withMessage("El consultorio es obligatorio para citas presenciales"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  ctrl.create
);

module.exports = router;
