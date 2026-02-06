const db = require("../models");
const { Op } = require("sequelize");

// Crear solicitud de cita (paciente)
exports.createRequest = async (req, res) => {
  try {
    const { message, preferredDate, specialty, type } = req.body;
    const user = req.user;

    const patient = await db.Patient.findOne({ where: { userId: user.id } });
    if (!patient) {
      return res.status(400).json({ error: "Paciente no encontrado" });
    }

    // Verificar si ya tiene una solicitud pendiente
    const pendingRequest = await db.AppointmentRequest.findOne({
      where: {
        patientId: patient.id,
        status: 'pendiente'
      }
    });

    if (pendingRequest) {
      return res.status(409).json({
        error: "Ya tienes una solicitud de cita pendiente. Espera a que sea atendida o cancélala."
      });
    }

    const appointmentRequest = await db.AppointmentRequest.create({
      patientId: patient.id,
      message,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      specialty: specialty || null,
      type: type || 'presencial',
      status: 'pendiente'
    });

    res.status(201).json(appointmentRequest);
  } catch (err) {
    console.error("Error al crear solicitud:", err);
    res.status(500).json({ error: err.message });
  }
};

// Listar solicitudes de citas
exports.list = async (req, res) => {
  try {
    const { patientId, status } = req.query;
    const user = req.user;
    const where = {};

    // Si es paciente, solo ve sus propias solicitudes
    if (user.role === 'patient') {
      const patient = await db.Patient.findOne({ where: { userId: user.id } });
      if (patient) {
        where.patientId = patient.id;
      }
    } else if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      where.status = status;
    }

    const requests = await db.AppointmentRequest.findAll({
      where,
      include: [
        {
          model: db.Patient,
          include: [
            {
              model: db.User,
              attributes: ['name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (err) {
    console.error("Error al listar solicitudes:", err);
    res.status(500).json({ error: err.message });
  }
};

// Actualizar estado de solicitud (doctor/admin)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, assignedDoctorId } = req.body;

    const request = await db.AppointmentRequest.findByPk(id, {
      include: [
        {
          model: db.Patient,
          include: [{ model: db.User, attributes: ['name', 'email'] }]
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (request.status !== 'pendiente') {
      return res.status(400).json({
        message: "Esta solicitud ya fue procesada anteriormente"
      });
    }

    request.status = status || request.status;

    if (status === 'rechazada' && rejectionReason) {
      request.rejectionReason = rejectionReason;
    }

    if (assignedDoctorId) {
      request.assignedDoctorId = assignedDoctorId;
    }

    await request.save();

    res.json(request);
  } catch (err) {
    console.error("Error al actualizar solicitud:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener solicitud por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await db.AppointmentRequest.findByPk(id, {
      include: [
        {
          model: db.Patient,
          include: [{ model: db.User, attributes: ['name', 'email'] }]
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    res.json(request);
  } catch (err) {
    console.error("Error al obtener solicitud:", err);
    res.status(500).json({ error: err.message });
  }
};

// Cancelar solicitud (paciente)
exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const patient = await db.Patient.findOne({ where: { userId: user.id } });

    const request = await db.AppointmentRequest.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Verificar que la solicitud pertenece al paciente
    if (user.role === 'patient' && request.patientId !== patient?.id) {
      return res.status(403).json({ message: "No tienes permiso para cancelar esta solicitud" });
    }

    if (request.status !== 'pendiente') {
      return res.status(400).json({ message: "Solo se pueden cancelar solicitudes pendientes" });
    }

    await request.destroy(); // Soft delete

    res.json({ message: "Solicitud cancelada exitosamente" });
  } catch (err) {
    console.error("Error al cancelar solicitud:", err);
    res.status(500).json({ error: err.message });
  }
};
