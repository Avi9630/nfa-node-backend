const CONSTANT = require("../libraries/Constant");
const Joi = require("joi");

const ArticleHelper = {
  storeValidate: (payload) => {
    const schema = Joi.object({
      article_type: Joi.number().valid(0, 1).required(),

      best_film_critic_id: Joi.number().required(),

      writer_name: Joi.string().required(),

      article_title: Joi.string().required(),

      language_id: Joi.array().items(Joi.number()).required(),

      other_language: Joi.any().when("language_id", {
        is: Joi.array().has(Joi.valid(24)), // key logic here
        then: Joi.string().required().messages({
          "any.required":
            "Other language is required when language_id includes 24.",
        }),
        otherwise: Joi.forbidden(),
      }),

      date_of_publication: Joi.date().iso().required(),

      name_of_publication: Joi.string().required(),

      publisher_name: Joi.string().required(),

      publisher_email: Joi.string().email().required(),

      publisher_mobile: Joi.string().required(),

      publisher_landline: Joi.string().allow(null, ""),

      publisher_address: Joi.string().required(),

      publisher_citizenship: Joi.string().required(),

      rni: Joi.when("article_type", {
        is: 0,
        then: Joi.any().required().messages({
          "any.required": "RNI is required when article_type is 0.",
        }),
        otherwise: Joi.forbidden(),
      }),

      publisher_furnished: Joi.when("article_type", {
        is: 1,
        then: Joi.number().valid(0, 1).required(),
        otherwise: Joi.forbidden(),
      }),

      original_writing: Joi.when("article_type", {
        is: 1,
        then: Joi.number().valid(0, 1).required(),
        otherwise: Joi.forbidden(),
      }),

      website_link: Joi.when("article_type", {
        is: 1,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
    });

    return schema.validate(payload, { abortEarly: false, allowUnknown: true });
  },
};

module.exports = ArticleHelper;
