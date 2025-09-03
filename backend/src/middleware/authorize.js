const db = require("../models/index");

function authorizeSelfOrRoles(...roles) {
  return async (req, res, next) => {
    const user = req.user;
    const patientId =
      parseInt(req.query.patientId) || parseInt(req.params.patientId);

    if (roles.includes(user.role)) return next();

    if (user.role === "patient") {
      const patient = await db.Patient.findOne({ where: { userId: user.id } });
      if (!patient)
        return res
          .status(403)
          .json({ message: "No es un paciente registrado" });
      if (patient.id === patientId) return next();
      return res
        .status(403)
        .json({ message: "Sin permisos para ver otros pacientes" });
    }

    return res.status(403).json({ message: "Sin permisos" });
  };
}

module.exports = authorizeSelfOrRoles;
