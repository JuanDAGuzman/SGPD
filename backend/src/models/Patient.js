const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Patient = sequelize.define('Patient', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  contactInfo: DataTypes.STRING,
  clinicalInfo: DataTypes.STRING,
}, {
  timestamps: true,
  paranoid: true,
});
Patient.belongsTo(User, { foreignKey: 'userId' });

module.exports = Patient;
