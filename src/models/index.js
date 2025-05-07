const { Sequelize } = require("sequelize");
// const { NfaFeature } = require("../models/NfaFeature");
// const { Document } = require("../models/Document");
const dotenv = require("dotenv");
dotenv.config();

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

// const models = {
//   NfaFeature,
//   Document,
// };

// Object.values(models).forEach((model) => {
//   console.log(model);

//   if (model.associate) {
//     model.associate(models);
//   }
// });

module.exports = sequelize;
