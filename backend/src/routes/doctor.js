const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/doctorController");
const { authenticate, authorize } = require("../middleware/auth");

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Crear doctor (solo admin)
 *     tags: [Doctores]
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
 *               specialty:
 *                 type: string
 *               medicalCenterId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Doctor creado
 */

router.post("/", authenticate, authorize("admin"), ctrl.create);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Listar todos los doctores
 *     tags: [Doctores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de doctores
 */
router.get("/", authenticate, authorize("admin", "doctor"), ctrl.getAll);

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Actualizar doctor por ID
 *     tags: [Doctores]
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
 *               specialty:
 *                 type: string
 *               medicalCenterId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Doctor actualizado
 *       404:
 *         description: Doctor no encontrado
 */
router.put("/:id", authenticate, authorize("admin"), ctrl.update);

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Eliminar doctor por ID (borrado lógico)
 *     tags: [Doctores]
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
 *         description: Doctor eliminado
 *       404:
 *         description: Doctor no encontrado
 */
router.delete("/:id", authenticate, authorize("admin"), ctrl.delete);

module.exports = router;
