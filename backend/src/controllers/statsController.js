const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const MedicalCenter = require('../models/MedicalCenter');
const Notification = require('../models/Notification');
const Appointment = require('../models/Appointment');
const { Op } = require('sequelize');

/**
 * @swagger
 * /api/stats/dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard de admin
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del sistema
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Contar pacientes totales y activos
    const totalPatients = await Patient.count();
    const activePatients = await Patient.count({
      where: {
        deletedAt: null,
      },
    });

    // Contar doctores registrados
    const totalDoctors = await Doctor.count();

    // Contar centros de salud
    const totalCenters = await MedicalCenter.count();

    // Contar usuarios por rol
    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count'],
      ],
      group: ['role'],
    });

    // Obtener notificaciones urgentes recientes
    const urgentNotifications = await Notification.count({
      where: {
        urgent: true,
        read: false,
      },
    });

    // Contar nuevos registros hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newRegistrationsToday = await User.count({
      where: {
        createdAt: {
          [Op.gte]: today,
        },
      },
    });

    // Contar citas pendientes
    const pendingAppointments = await Appointment.count({
      where: {
        status: 'programada',
      },
    });

    const stats = {
      patients: {
        total: totalPatients,
        active: activePatients,
      },
      doctors: {
        total: totalDoctors,
      },
      centers: {
        total: totalCenters,
      },
      usersByRole: usersByRole.reduce((acc, curr) => {
        acc[curr.role] = parseInt(curr.dataValues.count);
        return acc;
      }, {}),
      alerts: {
        urgent: urgentNotifications,
        newRegistrationsToday,
        pendingAppointments,
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/stats/recent-activity:
 *   get:
 *     summary: Obtener actividad reciente del sistema
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Actividad reciente
 */
exports.getRecentActivity = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Nuevos usuarios en los últimos 7 días
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    // Nuevos pacientes en los últimos 7 días
    const newPatients = await Patient.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    // Nuevos doctores en los últimos 7 días
    const newDoctors = await Doctor.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    res.json({
      lastSevenDays: {
        newUsers,
        newPatients,
        newDoctors,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /api/stats/doctor-dashboard:
 *   get:
 *     summary: Obtener estadísticas del dashboard del doctor
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas del doctor
 */
exports.getDoctorDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener el doctor por el userId
    const doctor = await Doctor.findOne({
      where: { userId },
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Perfil de doctor no encontrado' });
    }

    const doctorId = doctor.id;

    // Contar pacientes únicos atendidos (citas finalizadas)
    const patientsAttended = await Appointment.count({
      where: {
        doctorId,
        status: 'finalizada',
      },
      distinct: true,
      col: 'patientId',
    });

    // Contar consultas virtuales realizadas
    const virtualConsultations = await Appointment.count({
      where: {
        doctorId,
        type: 'virtual',
        status: 'finalizada',
      },
    });

    // Contar citas del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const appointmentsThisMonth = await Appointment.count({
      where: {
        doctorId,
        status: 'finalizada',
        date: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    // Obtener próximas citas (máximo 5)
    const upcomingAppointments = await Appointment.findAll({
      where: {
        doctorId,
        status: 'programada',
        date: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Patient,
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
      order: [['date', 'ASC']],
      limit: 5,
    });

    const stats = {
      patientsAttended,
      virtualConsultations,
      appointmentsThisMonth,
      upcomingAppointments: upcomingAppointments.map((apt) => ({
        id: apt.id,
        date: apt.date,
        type: apt.type,
        location: apt.location,
        patientName: apt.Patient?.User?.name || 'Paciente',
        meetingLink: apt.meetingLink,
      })),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas del doctor:', error);
    res.status(500).json({ error: error.message });
  }
};
