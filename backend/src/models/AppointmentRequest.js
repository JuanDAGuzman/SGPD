const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Patient = require("./Patient");

const AppointmentRequest = sequelize.define("AppointmentRequest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  preferredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING, // 'presencial' o 'virtual'
    defaultValue: 'presencial',
  },
  status: {
    type: DataTypes.STRING, // 'pendiente', 'aceptada', 'rechazada'
    defaultValue: "pendiente",
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedDoctorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Se llena cuando se crea la cita confirmada
  },
}, {
  timestamps: true,
  paranoid: true,
});

AppointmentRequest.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = AppointmentRequest;
