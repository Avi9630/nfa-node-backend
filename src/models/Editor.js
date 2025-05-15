const { DataTypes } = require("sequelize");
const sequelize = require(".");

const Editor = sequelize.define(
  "Editor",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    best_book_cinema_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    best_film_critic_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    editor_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    editor_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },

    editor_mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },

    editor_landline: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    editor_fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    editor_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    editor_citizenship: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "editors",
  }
);

module.exports = { Editor };
