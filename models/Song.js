const { DataTypes } = require("sequelize");
const sequelize = require(".");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Song = sequelize.define(
  "Song",
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

    song_title: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    music_director: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    music_director_bkgd_music: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    lyricist: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    playback_singer_male: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    playback_singer_female: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "songs",
  }
);

module.exports = { Song };
