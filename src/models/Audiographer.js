const { DataTypes } = require("sequelize");
const sequelize = require(".");

const Audiographer = sequelize.define(
  "Audiographer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nfa_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    production_sound_recordist: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    sound_designer: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    re_recordist_filnal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "audiographers",
  }
);

module.exports = { Audiographer };
