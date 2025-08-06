const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const DoctorRequest = sequelize.define('DoctorRequest', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  cardNumber: DataTypes.STRING,        // N° de tarjeta profesional
  documents: DataTypes.STRING,         // URL a los documentos (puedes hacer array/string)
  status: { type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'), defaultValue: 'pendiente' },
  reason: DataTypes.TEXT               // Motivo de rechazo si aplica
}, {
  timestamps: true,
  paranoid: true,
});
DoctorRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = DoctorRequest;
