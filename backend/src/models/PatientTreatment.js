const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Treatment = require('./Treatment');
const Doctor = require('./Doctor');

const PatientTreatment = sequelize.define('PatientTreatment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  treatmentId: { type: DataTypes.INTEGER, allowNull: false },
  prescribedBy: { type: DataTypes.INTEGER, allowNull: false }, // doctorId
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: DataTypes.DATE,
  status: { type: DataTypes.ENUM('active', 'completed', 'suspended'), defaultValue: 'active' },
  notes: DataTypes.TEXT,
}, {
  timestamps: true,
  paranoid: true,
});
PatientTreatment.belongsTo(Patient, { foreignKey: 'patientId' });
PatientTreatment.belongsTo(Treatment, { foreignKey: 'treatmentId' });
PatientTreatment.belongsTo(Doctor, { foreignKey: 'prescribedBy' });

module.exports = PatientTreatment;
