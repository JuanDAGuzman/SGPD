const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalCenter = sequelize.define('MedicalCenter', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: DataTypes.STRING, // clinica, hospital, ips, centro_salud
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  department: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  regime: DataTypes.STRING, // contributivo, subsidiado, mixto
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = MedicalCenter;
