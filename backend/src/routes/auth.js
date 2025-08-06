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

module.exports = router;
