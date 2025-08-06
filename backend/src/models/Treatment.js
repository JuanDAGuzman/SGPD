const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Treatment = sequelize.define('Treatment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true,
  paranoid: true,
});

module.exports = Treatment;
