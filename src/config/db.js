const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
});

module.exports = knex;
