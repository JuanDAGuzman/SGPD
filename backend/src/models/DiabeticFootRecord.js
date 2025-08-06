const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const DiabeticFootRecord = sequelize.define('DiabeticFootRecord', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  description: DataTypes.TEXT,
}, {
  timestamps: true,
  paranoid: true,
});
DiabeticFootRecord.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = DiabeticFootRecord;
