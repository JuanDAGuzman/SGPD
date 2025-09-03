const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AppointmentRequest = sequelize.define("AppointmentRequest", {
  // Tus campos aquí, por ejemplo:
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preferredDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pendiente",
  },
});

module.exports = AppointmentRequest;
