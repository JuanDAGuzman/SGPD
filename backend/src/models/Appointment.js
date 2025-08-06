const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Appointment = sequelize.define('Appointment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM('programada', 'finalizada', 'cancelada', 'reprogramada', 'no_asistio', 'en_atencion'),
    defaultValue: 'programada'
  },
  type: {
    type: DataTypes.ENUM('presencial', 'virtual'),
    defaultValue: 'presencial'
  },
  location: DataTypes.STRING,    // solo presencial
  room: DataTypes.STRING,        // solo presencial
  meetingLink: DataTypes.STRING, // solo virtual
  notes: DataTypes.TEXT
}, {
  timestamps: true,
  paranoid: true,
});
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Appointment;
