const validator = require("validator");
const CONSTANT = require("../libraries/Constant");

const BestBookCinemaHelper = {
  validateStepInput: (payload, files) => {
    const errors = {};
    const step = payload.step;

    if (!step || !validator.isInt(step)) {
      errors.step = "Step is required and must be a number.";
    }

    if (step && step !== String(CONSTANT.stepsBestBook().BEST_BOOK_ON_CINEMA)) {
      if (!payload.last_id || validator.isEmpty(String(payload.last_id))) {
        errors.last_id = "Last ID is required for this step.";
      }
    }

    //AUTHOR
    if (step === String(CONSTANT.stepsBestBook().AUTHOR)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (
        !payload.author_name ||
        validator.isEmpty(payload.author_name.trim())
      ) {
        errors.author_name = "Author name is required.!";
      }

      if (
        !payload.author_contact ||
        validator.isEmpty(payload.author_contact.trim())
      ) {
        errors.author_contact = "Author contact is required";
      } else if (!validator.isMobilePhone(payload.author_contact, "en-IN")) {
        errors.author_contact =
          "Contact number must be a valid 10-digit Indian number";
      }

      if (
        !payload.author_address ||
        validator.isEmpty(payload.author_address.trim())
      ) {
        errors.author_address = "Author address is required.";
      }

      if (!["0", "1", 0, 1].includes(payload.author_nationality_indian)) {
        errors.author_nationality_indian =
          "Author nationality must be. Ex:- 0 or 1";
      }

      if (
        !payload.author_profile ||
        validator.isEmpty(payload.author_profile.trim())
      ) {
        errors.author_profile = "Author profile is required.!";
      }

      const authorAadhaar = files?.find(
        (file) => file.fieldname === "author_aadhaar_card"
      );

      if (authorAadhaar) {
        if (typeof authorAadhaar !== "object" || !authorAadhaar.mimetype) {
          errors.author_aadhaar_card =
            "Author aadhaar card must be a valid file.";
        }
      }
    }

    //DECLARATION
    if (String(step) === String(CONSTANT.stepsBestBook().DECLARATION)) {
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

module.exports = BestBookCinemaHelper;
