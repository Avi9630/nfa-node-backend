const { DataTypes } = require("sequelize");
const sequelize = require(".");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { date } = require("joi");

const Twoauth = sequelize.define(
  "Twoauth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { notEmpty: true },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },
    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },
    authcode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isNumeric: true, len: [6, 6] },
    },
    is_verifed: { type: DataTypes.TINYINT },
    ipaddress: { type: DataTypes.STRING, allowNull: true },
    date: { type: DataTypes.DATE, allowNull: true },
  },
  {
    timestamps: false,
    tableName: "twoauths",
  }
);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

Twoauth.generateOtp = generateOtp;
module.exports = { Twoauth };
