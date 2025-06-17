const BestBookCinemaLibrary = require("../libraries/BestBookCinemaLibrary");
const BestFilmCriticLibrary = require("../libraries/BestFilmCriticLibrary");
const CONSTANT = require("../libraries/Constant");
const { DataTypes } = require("sequelize");
const { Document } = require("./Document");
const sequelize = require(".");

const BestFilmCritic = sequelize.define(
  "BestFilmCritic",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    step: { type: DataTypes.INTEGER, allowNull: true },
    active_step: { type: DataTypes.TINYINT, allowNull: true },
    payment_status: { type: DataTypes.TINYINT, allowNull: true },

    client_id: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    critic_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    critic_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    critic_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    nationality: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    critic_profile: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    declaration_one: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    declaration_two: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    declaration_three: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    declaration_four: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    created_at: { type: DataTypes.TIME },
    updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "best_film_critics",
  }
);

BestFilmCritic.hasMany(Document, {
  foreignKey: "context_id",
  sourceKey: "id",
  as: "documents",
});

const consumeRecords = async (payload) => {
  const methodMap = {
    [CONSTANT.stepsBestFilmCritic().CRITIC_DETAILS]: "consumeCRITICDETAILS",
    [CONSTANT.stepsBestFilmCritic().ARTICLE]: "consumeARTICLE",
    [CONSTANT.stepsBestFilmCritic().DECLARATION]: "consumeDECLARATION",
  };
  if (methodMap[payload.step]) {
    return BestFilmCriticLibrary[methodMap[payload.step]](payload);
  }
  return {};
};

const createFilmCritic = async (data) => {
  try {
    const created = await BestFilmCritic.create(data);
    if (!created) {
      throw new Error("Best film critic creation failed. Please try again.!!");
    }
    return created;
  } catch (error) {
    console.error("Best book creation error:", error);
    throw new Error(
      "An error occurred while creating the best film critic form.!!"
    );
  }
};

BestFilmCritic.consumeRecords = consumeRecords;
BestFilmCritic.createFilmCritic = createFilmCritic;
module.exports = { BestFilmCritic };
