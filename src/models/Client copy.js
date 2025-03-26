const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      mobile: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 10],
        },
      },
      pincode: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [6, 6],
        },
      },
      aadhar_number: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
          isNumeric: true,
          len: [12, 12],
        },
      },
      landline: {
        type: DataTypes.STRING,
        allowNull: true, // Changed to allowNull: true as it's optional
      },
      address: {
        type: DataTypes.TEXT, // Changed to TEXT for longer addresses
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      usertype: {
        type: DataTypes.INTEGER, // Changed back to INTEGER if storing 1/2
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [6, 255], // Minimum password length
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      activate_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "clients",
      paranoid: true, // Optional: enables soft deletes
    }
  );

  return Client;
};
