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
  "/user/:userId",
  authenticate,
  authorize("patient", "admin", "doctor"),
  patientCtrl.getByUserId
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
  authorize("admin", "doctor", "patient"),
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

router.get(
  "/profile",
  authenticate,
  authorize("patient", "admin", "doctor"),
  async (req, res) => {
    try {
      const userId = req.user.id; // El userId viene del middleware de autenticación
      const db = require("../models"); // Asegúrate que apunte a tus modelos
      const patient = await db.Patient.findOne({
        where: { userId },
        include: [{ model: db.User }],
      });
      if (!patient) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }
      res.json(patient);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al obtener el perfil del paciente" });
    }
  }
);

router.get("/by-patient-id/:id", patientCtrl.getByPatientId);

module.exports = router;
