const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("admin", "doctor", "patient"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "rejected"),
      defaultValue: "pending",
    },
  },
  {
    timestamps: true,
    paranoid: true,
  }
);

module.exports = User;
