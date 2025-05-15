const { DataTypes } = require("sequelize");
const sequelize = require(".");

const Book = sequelize.define(
  "Book",
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

    best_book_cinemas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    book_title_original: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    book_title_english: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: { notEmpty: true },
    },

    english_translation_book: {
      type: DataTypes.STRING,
      allowNull: true,
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
    },

    author_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    page_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    date_of_publication: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    book_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "books",
  }
);

module.exports = { Book };
