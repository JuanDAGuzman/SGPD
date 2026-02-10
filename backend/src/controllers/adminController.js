const User = require("../models/User");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

exports.getPendingUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { status: "pending" },
            attributes: ["id", "name", "email", "role", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' or 'rejected'

        if (!["active", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        user.status = status;
        await user.save();

        res.json({ message: `Usuario ${status === "active" ? "aprobado" : "rechazado"} exitosamente` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
