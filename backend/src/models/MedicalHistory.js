const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const MedicalHistory = sequelize.define('MedicalHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  appointmentId: { type: DataTypes.INTEGER, unique: true, allowNull: true },

  // Subjetivo
  reason: DataTypes.TEXT, // Motivo de consulta
  currentIllness: DataTypes.TEXT, // Enfermedad actual
  background: DataTypes.TEXT, // Antecedentes

  // Objetivo
  physicalExam: DataTypes.TEXT, // Examen físico (Signos vitales, hallazgos)

  // Análisis
  diagnosis: DataTypes.TEXT, // Diagnóstico principal

  // Plan
  treatment: DataTypes.TEXT, // Plan de tratamiento / Receta (guardado como texto simple por ahora)
  notes: DataTypes.TEXT // Notas adicionales / Evolución
}, {
  timestamps: true,
  paranoid: true,
});

MedicalHistory.belongsTo(Patient, { foreignKey: 'patientId' });

const Doctor = require('./Doctor');
MedicalHistory.belongsTo(Doctor, { foreignKey: 'doctorId' });

const Appointment = require('./Appointment');
MedicalHistory.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = MedicalHistory;
