const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Patient = require("../models/Patient");
require("dotenv").config();
const crypto = require("crypto");
const { Op } = require("sequelize");
const { sendTestMail } = require("../utils/mailer");

// Registro de usuarios (admin, doctor, patient)
exports.register = async (req, res) => {
  try {
    const { name, email, password, contactInfo, clinicalInfo } = req.body;
    // NO se recibe 'role' desde el cliente
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    // role SIEMPRE será "patient"
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "patient",
    });

    await Patient.create({
      userId: user.id,
      contactInfo: contactInfo || "",
      clinicalInfo: clinicalInfo || "",
    });

    res.status(201).json({
      message: "Usuario registrado como paciente",
      user: { id: user.id, name, email, role: "patient" },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: new Date() },
      },
    });
    if (!user)
      return res.status(400).json({ message: "Token inválido o expirado." });

    // Cambia la contraseña
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: "Contraseña restablecida correctamente." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email no registrado" });

    // Genera token seguro y expira en 1h
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    // Enviar por correo (Ethereal en pruebas)
    const resetLink = `http://localhost:4000/api/auth/reset-password?token=${resetToken}`;
    const text = `Hola, has solicitado restablecer tu contraseña. Usa este link:\n${resetLink}\n\nEl enlace expira en 1 hora.`;
    const html = `<p>Hola, has solicitado restablecer tu contraseña.</p>
                  <p><a href="${resetLink}">Haz clic aquí para restablecer</a></p>
                  <p>El enlace expira en 1 hora.</p>`;
    await sendTestMail(user.email, "Restablecer contraseña", text, html);

    res.json({ message: "Correo de restablecimiento enviado." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "No existe usuario" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, secret } = req.body;
    if (secret !== process.env.SECRET_ADMIN_KEY)
      return res.status(403).json({ message: "Llave secreta inválida" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin creado",
      user: { id: user.id, name, email, role: "admin" },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
