var validator = require("validator");

const ActorSchema = {
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

    if (
      !trimmedData.actor_category_id ||
      !validator.isInt(trimmedData.actor_category_id)
    ) {
      errors.actor_category_id =
        "Actor category is required.!! && must be number.!!";
    }

    if (!trimmedData.name) {
      errors.name = "Actor name is required.!!";
    }

    if (!trimmedData.screen_name) {
      errors.screen_name = "Screen name is required.!!";
    }

    if (!["0", "1", 0, 1].includes(trimmedData.if_voice_dubbed)) {
      errors.if_voice_dubbed = " Voice dubbed must be. Ex:- 0 or 1";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateUpdate: (data, files) => {
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

    if (
      trimmedData.actor_category_id !== undefined &&
      trimmedData.actor_category_id !== null &&
      !validator.isInt(trimmedData.actor_category_id)
    ) {
      errors.actor_category_id =
        "Actor category should be integer if provided.!!";
    }

    if (
      trimmedData.if_voice_dubbed !== undefined &&
      trimmedData.if_voice_dubbed !== null &&
      // !validator.isInt(trimmedData.if_voice_dubbed) &&
      !["0", "1", 0, 1].includes(trimmedData.if_voice_dubbed)
    ) {
      errors.if_voice_dubbed =
        "If voice dubbed should be integer and Only EX- 0,1 if provided.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateListProducer: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    const isEmpty = (value) =>
      value === undefined || value === null || value === "";
    const isNotNumber = (value) => isNaN(String(value));

    if (
      (isEmpty(trimmedData.nfa_feature_id) ||
        isNotNumber(trimmedData.nfa_feature_id)) &&
      (isEmpty(trimmedData.nfa_non_feature_id) ||
        isNotNumber(trimmedData.nfa_non_feature_id))
    ) {
      errors.nfa_feature_id =
        "Either a valid NFA feature ID or NFA non-feature ID is required!";
      errors.nfa_non_feature_id =
        "Either a valid NFA feature ID or NFA non-feature ID is required!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = ActorSchema;
