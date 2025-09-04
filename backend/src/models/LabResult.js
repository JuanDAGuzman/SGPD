const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const LabResult = sequelize.define('LabResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  description: DataTypes.TEXT,
  resultFile: DataTypes.STRING, 
}, {
  timestamps: true,
  paranoid: true,
});
LabResult.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = LabResult;
