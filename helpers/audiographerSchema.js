var validator = require("validator");

const AudiographerSchema = {
  validateStore: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (
      !trimmedData.nfa_feature_id ||
      !validator.isInt(trimmedData.nfa_feature_id)
    ) {
      errors.nfa_feature_id =
        "NFA feature ID is required.!! && must be number.!!";
    }

    if (!trimmedData.production_sound_recordist) {
      errors.production_sound_recordist =
        "Production sound recordist is required.!!";
    }

    if (!trimmedData.sound_designer) {
      errors.sound_designer = "Sound designer is required.!!";
    }

    if (!trimmedData.re_recordist_filnal) {
      errors.re_recordist_filnal = "Re-recordist final is required.!!";
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

    if (
      trimmedData.nfa_feature_id !== undefined &&
      trimmedData.nfa_feature_id !== null &&
      !validator.isInt(trimmedData.nfa_feature_id)
    ) {
      errors.nfa_feature_id = "NFA feature should be integer if provided.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

module.exports = AudiographerSchema;
