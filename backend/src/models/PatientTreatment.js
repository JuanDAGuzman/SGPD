const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Treatment = require('./Treatment'); // Catalog (Optional usage)
const Doctor = require('./Doctor');
const MedicalHistory = require('./MedicalHistory'); // Link to consultation

const PatientTreatment = sequelize.define('PatientTreatment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  medicalHistoryId: { type: DataTypes.INTEGER, allowNull: true }, // Link to specific consultation
  prescribedBy: { type: DataTypes.INTEGER, allowNull: false },

  // Medication Details
  medicationName: { type: DataTypes.STRING, allowNull: false }, // Name (from catalog or custom)
  dosage: { type: DataTypes.STRING, allowNull: true }, // e.g. "500 mg"
  frequency: { type: DataTypes.STRING, allowNull: true }, // e.g. "Every 8 hours"
  durationDays: { type: DataTypes.INTEGER, allowNull: true },

  // Timing
  startDate: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  endDate: { type: DataTypes.DATEONLY, allowNull: true },

  status: { type: DataTypes.ENUM('active', 'completed', 'suspended'), defaultValue: 'active' },
  notes: DataTypes.TEXT,
}, {
  timestamps: true,
  paranoid: true,
});

PatientTreatment.belongsTo(Patient, { foreignKey: 'patientId' });
PatientTreatment.belongsTo(Doctor, { foreignKey: 'prescribedBy' });
PatientTreatment.belongsTo(MedicalHistory, { foreignKey: 'medicalHistoryId' });

module.exports = PatientTreatment;
