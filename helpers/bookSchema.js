const { string } = require("joi");
var validator = require("validator");

const BookSchema = {
  validateStore: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.best_book_cinemas_id) {
      errors.best_book_cinemas_id = "Best book cinema id is required.!!";
    }

    if (!trimmedData.book_title_original) {
      errors.book_title_original = "Book title original is required.!!";
    }

    if (!trimmedData.book_title_english) {
      errors.book_title_english = "Book title english is required.!!";
    }

    if (!trimmedData.english_translation_book) {
      errors.english_translation_book =
        "English translation book is required.!!";
    }

    if (
      !trimmedData.language_id ||
      !Array.isArray(trimmedData.language_id) ||
      trimmedData.language_id.length === 0
    ) {
      errors.language_id = "Language is required and must be an array.!";
    }

    if (!trimmedData.author_name) {
      errors.author_name = "Author name is required.!!";
    }

    if (!trimmedData.page_count) {
      errors.page_count = "Page count is required.!!";
    }

    if (
      !trimmedData.date_of_publication ||
      !validator.isDate(trimmedData.date_of_publication, {
        format: "YYYY-MM-DD",
        strictMode: true,
      })
    ) {
      errors.date_of_publication =
        "Date of application is required and must be in YYYY-MM-DD format.";
    }

    if (!trimmedData.book_price) {
      errors.book_price = "Book price is required.!!";
    } else if (
      !validator.isDecimal(trimmedData.book_price.toString(), {
        force_decimal: false,
      })
    ) {
      errors.book_price = "Book price must be a valid number.";
    } else if (parseFloat(trimmedData.book_price) <= 0) {
      errors.book_price = "Book price must be greater than 0.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateUpdate: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.id || isNaN(String(trimmedData.id))) {
      errors.id = "ID is required and must be a number.!!";
    }

    if (!trimmedData.best_book_cinemas_id) {
      errors.best_book_cinemas_id = "Best book cinema id is required.!!";
    }

    if (
      trimmedData.language_id !== undefined &&
      trimmedData.language_id !== null &&
      !Array.isArray(trimmedData.language_id)
    ) {
      errors.language_id = "Language must be an array.!";
    }

    if (
      trimmedData.date_of_publication !== undefined &&
      trimmedData.date_of_publication !== null &&
      !validator.isDate(trimmedData.date_of_publication, {
        format: "YYYY-MM-DD",
        strictMode: true,
      })
    ) {
      errors.date_of_publication =
        "Date of application must be in YYYY-MM-DD format.!!";
    }

    if (
      trimmedData.book_price !== undefined &&
      trimmedData.book_price !== null &&
      !validator.isDecimal(trimmedData.book_price.toString(), {
        force_decimal: false,
      })
    ) {
      errors.book_price = "Book price must be a valid number.";
    } else if (parseFloat(trimmedData.book_price) <= 0) {
      errors.book_price = "Book price must be greater than 0.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateList: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.best_book_cinemas_id) {
      errors.best_book_cinemas_id = "Best book cinema id is required.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = BookSchema;
