const CONSTANT = require("../libraries/Constant");
// const validator = require("validator");
const Joi = require("joi");

const bestFilmCriticHelper = {
  validateStepInput: (data, files) => {
    const BEST_FILM_CRITIC = String(
      CONSTANT.stepsBestFilmCritic().CRITIC_DETAILS
    );
    const schema = Joi.object({
      step: Joi.number().required().messages({
        "any.required": "Step is required.!!",
        "number.base": "Step must be a number.!!",
      }),

      last_id: Joi.string().when("step", {
        not: Joi.valid(1), // If step is NOT 1
        then: Joi.string().required().messages({
          "any.required": "Last ID is required for this step.!!",
          "string.empty": "Last ID cannot be empty.!!",
        }),
        otherwise: Joi.string().optional(),
      }),

      critic_name: Joi.string().required().messages({
        "any.required": "Critic name is required.!!",
      }),

      critic_address: Joi.string().required().messages({
        "any.required": "Critic address is required.!!",
      }),

      critic_contact: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
          "string.empty": "Critic contact is required.!!",
          "string.pattern.base": "Enter a valid 10-digit mobile number.!!",
          "any.required": "Critic contact is required.!!",
        }),

      nationality: Joi.number().valid(0, 1).required().messages({
        "any.only": "Nationality must be either 0 or 1.!!",
        "any.required": "Nationality is required.!!",
        "number.base": "Nationality must be a number.",
      }),

      // // File validation (conditionally required based on step)
      // file: Joi.object({
      //   originalname: Joi.string().required(),
      //   mimetype: Joi.string()
      //     .valid("application/pdf", "image/jpeg", "image/png")
      //     .required()
      //     .messages({
      //       "any.only": "Only PDF, JPEG, or PNG files are allowed.",
      //     }),
      //   size: Joi.number()
      //     .max(2 * 1024 * 1024)
      //     .required()
      //     .messages({
      //       "number.max": "File size must be less than 2MB",
      //     }),
      // })
      //   .optional()
      //   .when("step", {
      //     is: BEST_FILM_CRITIC,
      //     then: Joi.required().messages({
      //       "any.required": "critic_aadhaar_card file is required.!!",
      //     }),
      //   }),

      critic_profile: Joi.string().required().messages({
        "any.required": "Critic profile is required.!!",
      }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
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
