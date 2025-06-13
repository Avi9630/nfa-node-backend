const { DataTypes } = require("sequelize");
const sequelize = require(".");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Actor = sequelize.define(
  "Actor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nfa_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    actor_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    screen_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    if_voice_dubbed: { type: DataTypes.TINYINT, allowNull: false },

    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "actors",
  }
);

module.exports = { Actor };
