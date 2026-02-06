const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");

const { body, validationResult } = require("express-validator");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario como paciente
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               contactInfo:
 *                 type: string
 *               clinicalInfo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registro exitoso
 *       409:
 *         description: Email ya registrado
 */

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener mínimo 6 caracteres"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authCtrl.register
);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */

router.post("/login", authCtrl.login);
/**
 * @swagger
 * /api/auth/create-admin:
 *   post:
 *     summary: Crear usuario admin con llave secreta
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               secret:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin creado
 *       403:
 *         description: Llave secreta inválida
 */

router.post("/create-admin", require("express").json(), authCtrl.createAdmin);

/**
 * @swagger
 * /api/auth/register-doctor:
 *   post:
 *     summary: Registrar nuevo doctor (solo admin)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               documentType:
 *                 type: string
 *               documentNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *               birthDate:
 *                 type: string
 *               specialty:
 *                 type: string
 *               professionalLicense:
 *                 type: string
 *               medicalCenterId:
 *                 type: integer
 *               city:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor registrado
 *       409:
 *         description: Email ya registrado
 */
router.post("/register-doctor", authCtrl.registerDoctor);

/**
 * @swagger
 * /api/auth/request-reset:
 *   post:
 *     summary: Solicitar restablecimiento de contraseña
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado
 */
router.post("/request-reset", authCtrl.requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña con token
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 *       400:
 *         description: Token inválido o expirado
 */
router.post("/reset-password", authCtrl.resetPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada
 *       401:
 *         description: Contraseña actual incorrecta
 */
const { authenticate } = require('../middleware/auth');
router.put("/change-password", authenticate, authCtrl.changePassword);

module.exports = router;
