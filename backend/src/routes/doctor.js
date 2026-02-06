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

router.get(
    "/profile",
    authenticate,
    authorize("doctor", "admin"),
    async (req, res) => {
        try {
            const userId = req.user.id;
            const db = require("../models");
            const doctor = await db.Doctor.findOne({
                where: { userId },
                include: [{ model: db.User }, { model: db.MedicalCenter }],
            });
            if (!doctor) {
                return res.status(404).json({ error: "Perfil de doctor no encontrado" });
            }
            res.json(doctor);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener perfil" });
        }
    }
);

/**
 * @swagger
 * /api/doctors/profile:
 *   put:
 *     summary: Actualizar perfil propio del doctor
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
 *               name:
 *                 type: string
 *               specialty:
 *                 type: string
 *               phone:
 *                 type: string
 *               city:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
 *       404:
 *         description: Perfil no encontrado
 */
router.put(
    "/profile",
    authenticate,
    authorize("doctor"),
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { name, specialty, phone, city } = req.body;
            const db = require("../models");

            // Buscar el doctor
            const doctor = await db.Doctor.findOne({
                where: { userId },
                include: [{ model: db.User }],
            });

            if (!doctor) {
                return res.status(404).json({ error: "Perfil de doctor no encontrado" });
            }

            // Actualizar campos del doctor
            if (specialty !== undefined) {
                await doctor.update({ specialty });
            }

            // Actualizar campos del usuario
            const updateUserData = {};
            if (name !== undefined) updateUserData.name = name;
            if (phone !== undefined) updateUserData.phone = phone;
            if (city !== undefined) updateUserData.city = city;

            if (Object.keys(updateUserData).length > 0) {
                await doctor.User.update(updateUserData);
            }

            // Recargar el doctor con datos actualizados
            const updatedDoctor = await db.Doctor.findOne({
                where: { userId },
                include: [{ model: db.User }, { model: db.MedicalCenter }],
            });

            res.json({
                message: "Perfil actualizado correctamente",
                doctor: updatedDoctor
            });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            res.status(500).json({ error: "Error al actualizar perfil" });
        }
    }
);

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
