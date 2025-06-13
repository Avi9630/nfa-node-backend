const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
// dotenv.config();

// const knex = require("knex")({
//   client: "mysql2",
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//   },
// });

// module.exports = knex;

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

module.exports = sequelize;
