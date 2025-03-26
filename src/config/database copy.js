require("dotenv").config();
const { Sequelize } = require("sequelize");
const Client = require("../models/client");
const sequelize = new Sequelize(
  process.env.DB_NAME, //"your_database",
  process.env.DB_USER, //"your_username",,
  process.env.DB_PASS, //"your_password",
  {
    host: process.env.DB_HOST, //"localhost",
    dialect: process.env.DB_DIALECT, //"mysql",
  }
);

module.exports = sequelize;
