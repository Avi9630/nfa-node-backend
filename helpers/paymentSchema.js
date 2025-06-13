var validator = require("validator");

const PaymentSchema = {
  validateData: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.last_id || !validator.isInt(trimmedData.last_id)) {
      errors.last_id = "Last ID is required.!! && must be number.!!";
    }

    const ALLOWED_FORMS = [
      "FEATURE",
      "NON_FEATURE",
      "BEST_BOOK",
      "BEST_FILM_CRITIC",
    ];

    if (!ALLOWED_FORMS.includes(trimmedData.form_type)) {
      errors.form_type =
        "Form type must be one of: FEATURE, NON_FEATURE, BEST_BOOK, BEST_FILM_CRITIC.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = PaymentSchema;
