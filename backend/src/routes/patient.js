const express = require("express");
const router = express.Router();
const patientCtrl = require("../controllers/patientController");
const { authenticate, authorize } = require("../middleware/auth");

// Solo admin y doctor pueden gestionar pacientes
/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Listar todos los pacientes
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */

router.get("/", authenticate, authorize("admin", "doctor"), patientCtrl.getAll);
/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Crear un paciente (solo admin o doctor)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               contactInfo:
 *                 type: string
 *               clinicalInfo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente creado
 */

router.post(
  "/",
  authenticate,
  authorize("admin", "doctor"),
  patientCtrl.create
);
/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags: [Pacientes]
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
 *         description: Paciente encontrado
 *       404:
 *         description: Paciente no encontrado
 */

router.get(
  "/:id",
  authenticate,
  authorize("admin", "doctor"),
  patientCtrl.getById
);
/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Actualizar paciente por ID
 *     tags: [Pacientes]
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
 *               contactInfo:
 *                 type: string
 *               clinicalInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paciente actualizado
 *       404:
 *         description: Paciente no encontrado
 */

router.put(
  "/:id",
  authenticate,
  authorize("admin", "doctor"),
  patientCtrl.update
);
/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Eliminar paciente por ID (borrado lógico)
 *     tags: [Pacientes]
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
 *         description: Paciente eliminado
 *       404:
 *         description: Paciente no encontrado
 */

router.delete("/:id", authenticate, authorize("admin"), patientCtrl.delete);

module.exports = router;
