const { DataTypes } = require("sequelize");
const sequelize = require(".");
const { Document } = require("./Document");

const Producer = sequelize.define(
  "Producer",
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

    nfa_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    nfa_non_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },

    contact_nom: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },

    pincode: {
      type: DataTypes.STRING(),
      allowNull: false,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    indian_national: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    producer_self_attested_doc: {
      type: DataTypes.STRING(),
      allowNull: false,
    },

    country_of_nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    receive_producer_award: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    production_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "producers",
  }
);

Producer.hasMany(Document, {
  foreignKey: "context_id",
  sourceKey: "id",
  as: "documents",
});

module.exports = { Producer };
