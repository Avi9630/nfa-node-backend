const BestBookCinemaLibrary = require("../libraries/BestBookCinemaLibrary");
const CONSTANT = require("../libraries/Constant");
const { DataTypes } = require("sequelize");
const sequelize = require(".");
const BestFilmCriticLibrary = require("../libraries/BestFilmCriticLibrary");

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

    writer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    article_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // article_title: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },

    article_language_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("article_language_id");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (e) {
          return [];
        }
      },
      // set(value) {
      //   this.setDataValue("article_language_id", JSON.stringify(value));
      // },
    },

    publication_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    publication_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    rni: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    rni_registration_no: {
      type: DataTypes.STRING,
      allowNull: true,
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

    critic_indian_nationality: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    critic_profile: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    critic_aadhaar_card: {
      type: DataTypes.STRING,
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
    created_at: { type: DataTypes.TIME },
    updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "best_film_critics",
  }
);

const consumeRecords = async (payload) => {
  const methodMap = {
    [CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC]: "consumeBESTFILMCRITIC",
    [CONSTANT.stepsBestFilmCritic().CRITIC]: "consumeCRITIC",
    [CONSTANT.stepsBestFilmCritic().PUBLISHER]: "consumePUBLISHER",
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
