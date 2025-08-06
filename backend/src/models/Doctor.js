const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const MedicalCenter = require('./MedicalCenter');

const Doctor = sequelize.define('Doctor', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  specialty: DataTypes.STRING,
  medicalCenterId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  timestamps: true,
  paranoid: true,
});
Doctor.belongsTo(User, { foreignKey: 'userId' });
Doctor.belongsTo(MedicalCenter, { foreignKey: 'medicalCenterId' });

module.exports = Doctor;
