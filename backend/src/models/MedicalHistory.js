const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const MedicalHistory = sequelize.define('MedicalHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  diagnosis: DataTypes.STRING,
  notes: DataTypes.TEXT
}, {
  timestamps: true,
  paranoid: true,
});
MedicalHistory.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = MedicalHistory;
