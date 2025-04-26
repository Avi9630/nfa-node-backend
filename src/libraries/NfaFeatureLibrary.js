const Joi = require("joi");

const NfaFeatureLibrary = {
  GENRAL: () => {
    const validatorSchema = {
      last_id: Joi.number().optional(),
      film_title_roman: Joi.string().required(),
      film_title_devnagri: Joi.string().required(),
      film_title_english: Joi.string().required(),
      language: Joi.string().required(),
      english_subtitle: Joi.valid(0, 1).required(),
      director_debut: Joi.valid(0, 1).required(),
      nom_reels_tapes: Joi.number().optional(),
      aspect_ratio: Joi.string()
        .pattern(/^\d+(:\d+)?$/)
        .required(),
      format: Joi.valid(1, 2, 3).required(),
      sound_system: Joi.valid(1, 2, 3, 4).required(),
      running_time: Joi.string()
        .pattern(/^\d+(:\d+)?$/)
        .required(),
      color_bw: Joi.valid(1, 2).required(),
      film_synopsis: Joi.string().optional(),
    };

    const messagesArray = {
      "english_subtitle.any.only": "English Subtitle must be 0 or 1",
      "director_debut.any.only": "Director debut must be 0 or 1",
      "color_bw.any.only": "Color/Black&White must be 1 or 2",
      "aspect_ratio.pattern.base": "Aspect ratio must be like 10:10 or 10",
      "running_time.pattern.base": "Running time must be like 10:10 or 10",
    };

    return { validatorSchema, messagesArray };
  },

  consumeGENERAL: (payload) => {
    return {
      client_id: payload.user.id,
      film_title_roman: payload.film_title_roman,
      film_title_devnagri: payload.film_title_devnagri,
      film_title_english: payload.film_title_english,
      language: payload.language,
      english_subtitle: payload.english_subtitle,
      director_debut: payload.director_debut,
      nom_reels_tapes: payload.nom_reels_tapes || null,
      aspect_ratio: payload.aspect_ratio,
      format: payload.format,
      sound_system: payload.sound_system,
      running_time: payload.running_time,
      color_bw: payload.color_bw,
      film_synopsis: payload.film_synopsis || null,
    };
  },

  CENSOR: () => {
    const validatorSchema = {
      last_id: Joi.number().required(),
      censor_certificate_nom: Joi.string().required(),
      censor_certificate_date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required(),
      censor_certificate_file: Joi.any(),
    };
    const messagesArray = {
      "censor_certificate_date.pattern.base":
        "The censor certificate date does not match the format (Y-m-d).",
      "censor_certificate_file.required":
        "Censor certificate file is required.!!",
    };
    return { validatorSchema, messagesArray };
  },

  consumeCENSOR: (payload) => {
    const censorFile = payload.files?.find(
      (file) => file.fieldname === "censor_certificate_file"
    );
    const consumeCensor = {
      last_id: payload.last_id,
      censor_certificate_nom: payload.censor_certificate_nom || null,
      censor_certificate_date: payload.censor_certificate_date || null,
      censor_certificate_file: censorFile,
    };
    return consumeCensor;
  },
};

module.exports = NfaFeatureLibrary;
