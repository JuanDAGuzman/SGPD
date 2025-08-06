const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalCenter = sequelize.define('MedicalCenter', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  address: DataTypes.STRING
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = MedicalCenter;
