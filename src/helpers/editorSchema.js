const { string } = require("joi");
var validator = require("validator");

const EditorSchema = {
  validateStore: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.best_book_cinema_id && !trimmedData.best_film_critic_id) {
      errors.best_book_cinema_id =
        "Either Best Book Cinema Id or Best Film Critic ID is required!";
      errors.best_film_critic_id =
        "Either Best Book Cinema Id or Best Film Critic ID is required!";
    }

    if (!trimmedData.editor_name) {
      errors.editor_name = "Editor name is required.!";
    }

    if (!trimmedData.editor_email) {
      errors.editor_email = "Editor email is required!";
    } else if (!validator.isEmail(trimmedData.editor_email)) {
      errors.editor_email = "Invalid email format!";
    }

    if (!trimmedData.editor_mobile) {
      errors.editor_mobile = "Editor mobile number is required.!";
    } else if (!validator.isMobilePhone(trimmedData.editor_mobile, "en-IN")) {
      errors.editor_mobile =
        "Editor mobile number must be a valid 10-digit Indian number!";
    }

    if (!trimmedData.editor_address) {
      errors.editor_address = "Editor address is required.!";
    }

    if (!trimmedData.editor_citizenship) {
      errors.editor_citizenship = "Editor citizenship is required.!";
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

    const isEmpty = (value) =>
      value === undefined || value === null || value === "";
    const isNotNumber = (value) => isNaN(String(value));

    if (
      (isEmpty(trimmedData.best_book_cinema_id) ||
        isNotNumber(trimmedData.best_book_cinema_id)) &&
      (isEmpty(trimmedData.best_film_critic_id) ||
        isNotNumber(trimmedData.best_film_critic_id))
    ) {
      errors.best_book_cinema_id =
        "Either a valid Best Book Cinema ID or Best Film Critic ID is required.!";
      errors.best_film_critic_id =
        "Either a valid Best Book Cinema ID or Best Film Critic ID is required.!";
    }

    if (
      trimmedData.editor_email !== undefined &&
      trimmedData.editor_email !== null &&
      !validator.isEmail(trimmedData.editor_email)
    ) {
      errors.editor_email = "Invalid editor email format.!";
    }

    if (
      trimmedData.editor_mobile &&
      typeof trimmedData.editor_mobile === "string" &&
      !validator.isMobilePhone(trimmedData.editor_mobile, "en-IN")
    ) {
      errors.editor_mobile = "Mobile must be a valid 10-digit Indian number";
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

    const isEmpty = (value) =>
      value === undefined || value === null || value === "";
    const isNotNumber = (value) => isNaN(String(value));

    if (
      (isEmpty(trimmedData.best_book_cinema_id) ||
        isNotNumber(trimmedData.best_book_cinema_id)) &&
      (isEmpty(trimmedData.best_film_critic_id) ||
        isNotNumber(trimmedData.best_film_critic_id))
    ) {
      errors.best_book_cinema_id =
        "Either a valid Best Book Cinema ID or Best Film Critic ID is required.!";
      errors.best_film_critic_id =
        "Either a valid Best Book Cinema ID or Best Film Critic ID is required.!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = EditorSchema;
