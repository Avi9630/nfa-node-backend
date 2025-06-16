const CONSTANT = require("../libraries/Constant");
const validator = require("validator");

const bestFilmCriticHelper = {
  validateStepInput: (payload, files) => {
    const errors = {};
    const step = payload.step;

    if (!step || !validator.isInt(step)) {
      errors.step = "Step is required and must be a number.";
    }

    if (
      step &&
      step !== String(CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC)
    ) {
      if (!payload.last_id || validator.isEmpty(String(payload.last_id))) {
        errors.last_id = "Last ID is required for this step.";
      }
    }

    //BEST_FILM_CRITIC
    if (step === String(CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC)) {
      if (
        !payload.writer_name ||
        validator.isEmpty(payload.writer_name.trim())
      ) {
        errors.writer_name = "Writer name is required.!";
      }

      if (
        !payload.article_title ||
        validator.isEmpty(payload.article_title.trim())
      ) {
        errors.article_title = "Article title is required.!";
      }

      if (
        !payload.article_language_id ||
        !Array.isArray(payload.article_language_id) ||
        payload.article_language_id.length === 0
      ) {
        errors.article_language_id =
          "Article language is required and must be an array.!";
      }

      if (
        !payload.publication_date ||
        !validator.isDate(payload.publication_date, {
          format: "YYYY-MM-DD",
          strictMode: true,
        })
      ) {
        errors.publication_date =
          "Publication Date is required and must be in YYYY-MM-DD format.!";
      }

      if (
        !payload.publication_name ||
        validator.isEmpty(payload.publication_name.trim())
      ) {
        errors.publication_name = "Publication name is required.!";
      }

      if (!["0", "1", 0, 1].includes(payload.rni)) {
        errors.rni = "RNI mustbe Ex:- 0 or 1";
      }

      if (payload.rni == 1) {
        if (
          !payload.rni_registration_no ||
          validator.isEmpty(payload.rni_registration_no.trim())
        ) {
          errors.rni_registration_no = "RNI registration number is required.!";
        }
      }
    }

    //CRITIC
    if (step === String(CONSTANT.stepsBestFilmCritic().CRITIC)) {
      if (
        !payload.critic_name ||
        validator.isEmpty(payload.critic_name.trim())
      ) {
        errors.critic_name = "Critic name is required.!!";
      }

      if (
        !payload.critic_address ||
        validator.isEmpty(payload.critic_address.trim())
      ) {
        errors.critic_address = "Critic address is required.!!";
      }

      if (
        !payload.critic_contact ||
        validator.isEmpty(payload.critic_contact.trim())
      ) {
        errors.critic_contact = "Critic contact is required";
      } else if (!validator.isMobilePhone(payload.critic_contact, "en-IN")) {
        errors.critic_contact =
          "Contact number must be a valid 10-digit Indian number";
      }

      if (!["0", "1", 0, 1].includes(payload.critic_indian_nationality)) {
        errors.critic_indian_nationality = "RNI mustbe Ex:- 0 or 1";
      }

      if (
        !payload.critic_profile ||
        validator.isEmpty(payload.critic_profile.trim())
      ) {
        errors.critic_profile = "Critic profile is required.!";
      }

      const criticAadhaar = files?.find(
        (file) => file.fieldname === "critic_aadhaar_card"
      );

      if (criticAadhaar) {
        if (typeof criticAadhaar !== "object" || !criticAadhaar.mimetype) {
          errors.critic_aadhaar_card = "Critic aadhaar must be a valid file.";
        }
      }
    }

    //DECLARATION
    if (String(step) === String(CONSTANT.stepsBestFilmCritic().DECLARATION)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (!["1", 1].includes(payload.declaration_one)) {
        errors.declaration_one = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_two)) {
        errors.declaration_two = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_three)) {
        errors.declaration_three = "Declaration is must be Yes(1).!!";
      }
    }

    // More steps to go

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  finalSubmitStep: (payload) => {
    const errors = {};
    if (!payload.last_id || validator.isEmpty(String(payload.last_id))) {
      errors.last_id = "Last ID is required.!!";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

module.exports = bestFilmCriticHelper;
