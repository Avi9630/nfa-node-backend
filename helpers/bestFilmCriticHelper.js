const CONSTANT = require("../libraries/Constant");
// const validator = require("validator");
const Joi = require("joi");

const bestFilmCriticHelper = {
  validateStepInput: (payload, files) => {
    const step = payload.step;
    const stepString = String(step);
    const CRITIC_DETAILS = String(
      CONSTANT.stepsBestFilmCritic().CRITIC_DETAILS
    );
    const ARTICLE = String(CONSTANT.stepsBestFilmCritic().ARTICLE);
    const DECLARATION = String(CONSTANT.stepsBestFilmCritic().DECLARATION);

    let schema = Joi.object({
      step: Joi.number().required().messages({
        "any.required": "Step is required.!!",
        "number.base": "Step must be a number.!!",
      }),
    });

    // Conditional schema additions based on step
    if (stepString !== CRITIC_DETAILS) {
      schema = schema.append({
        last_id: Joi.string().required().messages({
          "any.required": "Last ID is required for this step.",
          "string.empty": "Last ID is required for this step.",
        }),
      });
    }

    // BEST_FILM_CRITIC Step
    if (stepString === CRITIC_DETAILS) {
      schema = schema.append({
        critic_name: Joi.string().required().messages({
          "any.required": "Critic name is required.!!",
        }),

        critic_contact: Joi.string()
          .pattern(/^[6-9]\d{9}$/)
          .required()
          .messages({
            "string.empty": "Critic contact is required.!!",
            "string.pattern.base": "Enter a valid 10-digit mobile number.!!",
            "any.required": "Critic contact is required.!!",
          }),

        critic_address: Joi.string().required().messages({
          "any.required": "Critic address is required.!!",
        }),

        nationality: Joi.number().valid(0, 1).required().messages({
          "any.only": "Nationality must be either 0 or 1.!!",
          "any.required": "Nationality is required.!!",
          "number.base": "Nationality must be a number.",
        }),

        critic_aadhaar_card: Joi.object({
          originalname: Joi.string().required(),
          mimetype: Joi.string()
            .valid("application/pdf", "image/jpeg", "image/png")
            .required()
            .messages({
              "any.only": "Only PDF, JPEG, or PNG files are allowed.",
            }),
          size: Joi.number()
            .max(2 * 1024 * 1024)
            .required()
            .messages({
              "number.max": "File size must be less than 2MB",
            }),
        })
          .optional()
          .when("step", {
            is: CRITIC_DETAILS,
            then: Joi.required().messages({
              "any.required": "critic_aadhaar_card file is required.!!",
            }),
          }),

        critic_profile: Joi.string().required().messages({
          "any.required": "Critic profile is required.!!",
        }),
      });
    }

    // CRITIC Step
    if (stepString === ARTICLE) {
      schema = schema.append();
    }

    // DECLARATION Step
    if (stepString === DECLARATION) {
      schema = schema.append({
        last_id: Joi.number().required().messages({
          "any.required": "Last ID is required and must be a number.",
          "number.base": "Last ID must be a number.",
        }),
        declaration_one: Joi.alternatives()
          .try(Joi.string().valid("1"), Joi.number().valid(1))
          .required()
          .messages({
            "any.only": "Declaration is must be Yes(1).!!",
          }),

        declaration_two: Joi.alternatives()
          .try(Joi.string().valid("1"), Joi.number().valid(1))
          .required()
          .messages({
            "any.only": "Declaration is must be Yes(1).!!",
          }),

        declaration_three: Joi.alternatives()
          .try(Joi.string().valid("1"), Joi.number().valid(1))
          .required()
          .messages({
            "any.only": "Declaration is must be Yes(1).!!",
          }),

        declaration_four: Joi.alternatives()
          .try(Joi.string().valid("1"), Joi.number().valid(1))
          .required()
          .messages({
            "any.only": "Declaration is must be Yes(1).!!",
          }),
      });
    }

    return schema.validate(payload, { abortEarly: false, allowUnknown: true });
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
