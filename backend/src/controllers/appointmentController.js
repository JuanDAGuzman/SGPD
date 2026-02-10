const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const { nanoid } = require("nanoid");
const { Op } = require("sequelize");
const { sendTestMail } = require("../utils/mailer");

exports.getAll = async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    const where = {};

    // Filtros de seguridad según rol
    if (req.user.role === "patient") {
      const Patient = require("../models/Patient");
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (patient) {
        where.patientId = patient.id;
      } else {
        return res.json([]); // Si no tiene perfil de paciente, no tiene citas
      }
    } else if (req.user.role === "doctor") {
      const Doctor = require("../models/Doctor");
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (doctor) {
        where.doctorId = doctor.id;
      } else {
        return res.json([]);
      }
    } else {
      // Si es admin, permitimos filtrar por query params
      if (patientId) where.patientId = patientId;
      if (doctorId) where.doctorId = doctorId;
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Patient,
          include: [{ model: User, attributes: ["name", "email"] }],
        },
        {
          model: Doctor,
          include: [{ model: User, attributes: ["name", "email"] }],
        },
      ],
      order: [["date", "DESC"]],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.finishAllByPatient = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId)
      return res.status(400).json({ message: "Debes enviar el patientId" });

    const result = await Appointment.update(
      { status: "finalizada" },
      {
        where: {
          patientId,
          status: { [Op.in]: ["programada", "en_atencion"] },
        },
      }
    );
    res.json({ message: "Citas finalizadas", updated: result[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { patientId, doctorId, date, status, notes, type, location, address, room } =
      req.body;
    let meetingLink = null;

    const citaOcupada = await Appointment.findOne({
      where: {
        [Op.or]: [{ patientId }, { doctorId }],
        date: date,
        status: { [Op.in]: ["programada", "en_atencion"] },
      },
    });
    if (citaOcupada) {
      return res.status(409).json({
        message:
          "Ya existe una cita activa para ese paciente o doctor en ese horario.",
      });
    }

    const citaPendiente = await Appointment.findOne({
      where: {
        patientId,
        status: { [Op.in]: ["programada", "en_atencion"] },
        date: { [Op.lt]: date },
      },
    });
    if (citaPendiente) {
      return res.status(409).json({
        message:
          "El paciente tiene una cita anterior pendiente. Debe finalizarse o cancelarse antes de agendar una nueva.",
      });
    }

    if (type === "virtual") {
      // Usar un ID único para la sala para evitar conflictos
      const uniqueRoomId = `SGPD-Cita-${nanoid(10)}`;
      meetingLink = `https://meet.jit.si/${uniqueRoomId}`;
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      status,
      notes,
      type: type || "presencial",
      location: type === "presencial" ? location : null,
      address: type === "presencial" ? address : null,
      room: type === "presencial" ? room : null,
      meetingLink,
    });

    // Si la cita proviene de una solicitud, actualizamos la solicitud
    if (req.body.requestId) {
      const AppointmentRequest = require("../models/AppointmentRequest");
      try {
        const request = await AppointmentRequest.findByPk(req.body.requestId);
        if (request) {
          request.status = 'aceptada';
          request.appointmentId = appointment.id;
          request.assignedDoctorId = doctorId;
          await request.save();
        }
      } catch (reqErr) {
        console.warn("No se pudo actualizar la solicitud asociada:", reqErr.message);
      }
    }

    try {
      // Buscar modelos relacionales primero para obtener el userId real
      const Patient = require("../models/Patient");
      const Doctor = require("../models/Doctor");

      const patientRecord = await Patient.findByPk(patientId);
      const doctorRecord = await Doctor.findByPk(doctorId);

      if (!patientRecord || !doctorRecord) {
        throw new Error("No se encontraron registros de paciente o doctor para enviar notificaciones");
      }

      const paciente = await User.findByPk(patientRecord.userId);
      const doctor = await User.findByPk(doctorRecord.userId);

      if (!paciente || !doctor) {
        throw new Error("Usuarios asociados no encontrados");
      }

      let textoPaciente = `Hola ${paciente.name}, tu cita fue programada para el ${date}.`;
      let textoDoctor = `Hola Dr(a). ${doctor.name}, tienes una nueva cita con ${paciente.name} el ${date}.`;

      if (type === "virtual") {
        textoPaciente += `\nEnlace de consulta virtual: ${meetingLink}`;
        textoDoctor += `\nEnlace de consulta virtual: ${meetingLink}`;
      } else {
        const addrText = address ? ` (${address})` : '';
        textoPaciente += `\nLugar: ${location}${addrText} - Consultorio: ${room}`;
        textoDoctor += `\nLugar: ${location}${addrText} - Consultorio: ${room}`;
      }

      const htmlPaciente = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>¡Hola ${paciente.name}!</h2>
          <p>Tu cita fue <b>programada</b> para el <b>${date}</b>.</p>
          ${type === "virtual"
          ? `<p><b>Enlace de consulta virtual:</b><br>
                 <a href="${meetingLink}" style="color: #0a77e6;">${meetingLink}</a></p>`
          : `<p><b>Lugar:</b> ${location} ${address ? `(${address})` : ''} - <b>Consultorio:</b> ${room}</p>`
        }
          <hr>
          <p style="font-size: 0.95em; color: #888;">Gracias por confiar en nuestro sistema clínico.</p>
        </div>
      `;

      const htmlDoctor = `
        <div style="font-family: Arial, sans-serif; color: #222;">
          <h2>¡Nueva cita asignada!</h2>
          <p>Dr(a). <b>${doctor.name}</b>, tienes una cita con <b>${paciente.name
        }</b> el <b>${date}</b>.</p>
          ${type === "virtual"
          ? `<p><b>Enlace de consulta virtual:</b><br>
                 <a href="${meetingLink}" style="color: #0a77e6;">${meetingLink}</a></p>`
          : `<p><b>Lugar:</b> ${location} - <b>Consultorio:</b> ${room}</p>`
        }
          <hr>
          <p style="font-size: 0.95em; color: #888;">Este es un mensaje automático de SGPD.</p>
        </div>
      `;

      const linkPaciente = await sendTestMail(
        paciente.email,
        "Nueva cita agendada",
        textoPaciente,
        htmlPaciente
      );
      console.log("Vista previa correo paciente:", linkPaciente);

      const linkDoctor = await sendTestMail(
        doctor.email,
        "Nueva cita asignada",
        textoDoctor,
        htmlDoctor
      );
      console.log("Vista previa correo doctor:", linkDoctor);
    } catch (notifErr) {
      console.warn("No se pudo enviar notificación de cita:", notifErr.message);
    }

    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Patient,
          include: [{ model: User, attributes: ["name", "email"] }],
        },
        {
          model: Doctor,
          include: [{ model: User, attributes: ["name", "email"] }],
        },
      ],
    });
    if (!appointment) return res.status(404).json({ message: "No encontrada" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: "No encontrada" });
    await appointment.update(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) return res.status(404).json({ message: "No encontrada" });
    await appointment.destroy();
    res.json({ message: "Cita cancelada (lógica)" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
