const BestBookCinemaLibrary = require("../libraries/BestBookCinemaLibrary");
const CONSTANT = require("../libraries/Constant");
const { DataTypes } = require("sequelize");
const sequelize = require(".");

const BestBookCinema = sequelize.define(
  "BestBookCinema",
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

    author_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    author_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    author_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    author_nationality_indian: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    author_profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    author_aadhaar_card: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    declaration_one: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    declaration_two: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    declaration_three: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    created_at: { type: DataTypes.TIME },
    updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "best_book_cinemas",
  }
);

const consumeRecords = async (payload) => {
  const methodMap = {
    [CONSTANT.stepsBestBook().BEST_BOOK_ON_CINEMA]: "consumeBESTBOOKONCINEMA",
    [CONSTANT.stepsBestBook().AUTHOR]: "consumeAUTHOR",
    [CONSTANT.stepsBestBook().PUBLISHER_EDITOR]: "consumePUBLISHEREDITOR",
    [CONSTANT.stepsBestBook().DECLARATION]: "consumeDECLARATION",
  };

  if (methodMap[payload.step]) {
    return BestBookCinemaLibrary[methodMap[payload.step]](payload);
  }
  return {};
};

const createBestBook = async (data) => {
  try {
    const created = await BestBookCinema.create(data);
    if (!created) {
      throw new Error("Best book creation failed.!! Please try again.!!");
    }
    return created;
  } catch (error) {
    console.error("Best book creation error:", error);
    throw new Error("An error occurred while creating the best book form.!!");
  }
};

BestBookCinema.consumeRecords = consumeRecords;
BestBookCinema.createBestBook = createBestBook;
module.exports = { BestBookCinema };
