const { DataTypes } = require("sequelize");
const sequelize = require(".");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Article = sequelize.define(
  "Article",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { notEmpty: true },
    },

    best_film_critic_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { notEmpty: true },
    },

    article_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      validate: { notEmpty: true },
    },

    writer_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    article_title: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    language_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("language_id");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue("language_id", JSON.stringify(value));
      },
    },

    other_language: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    date_of_publication: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { notEmpty: true },
    },

    name_of_publication: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    rni: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_furnished: {
      type: DataTypes.TINYINT,
      allowNull: true,
      validate: { notEmpty: true },
    },

    original_writing: {
      type: DataTypes.TINYINT,
      allowNull: true,
      validate: { notEmpty: true },
    },

    website_link: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_landline: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },

    publisher_citizenship: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: true },
    },
  },
  {
    timestamps: false,
    tableName: "articles",
  }
);

module.exports = { Article };
