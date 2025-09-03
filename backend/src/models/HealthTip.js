const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HealthTip = sequelize.define("HealthTip", {
  tip: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = HealthTip;
