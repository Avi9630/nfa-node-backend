const validator = require("validator");
const CONSTANT = require("../libraries/Constant");

const NfaFeatureHelper = {
  validateStepInput: (payload, files) => {
    const errors = {};
    const step = payload.step;

    // STEP
    if (!step || !validator.isInt(step)) {
      errors.step = "Step is required and must be a number.";
    }

    // Step-based conditional validation
    if (step && step !== String(CONSTANT.stepsFeature().GENRAL)) {
      if (!payload.last_id || validator.isEmpty(String(payload.last_id))) {
        errors.last_id = "Last ID is required for this step.";
      }
    }

    //GENRAL
    if (step === String(CONSTANT.stepsFeature().GENRAL)) {
      if (
        !payload.film_title_roman ||
        validator.isEmpty(payload.film_title_roman.trim())
      ) {
        errors.film_title_roman = "Film title (Roman) is required.";
      }

      if (
        !payload.film_title_devnagri ||
        validator.isEmpty(payload.film_title_devnagri.trim())
      ) {
        errors.film_title_devnagri = "Film title (Devnagri) is required.";
      }

      if (
        !payload.film_title_english ||
        validator.isEmpty(payload.film_title_english.trim())
      ) {
        errors.film_title_english = "Film title (English) is required.";
      }

      if (!payload.language || validator.isEmpty(payload.language.trim())) {
        errors.language = "Language is required.";
      }

      // Required and in:0,1
      if (!["0", "1", 0, 1].includes(payload.english_subtitle)) {
        errors.english_subtitle = "English Subtitle must be. Ex:- 0 or 1";
      }

      if (!["0", "1", 0, 1].includes(payload.director_debut)) {
        errors.director_debut = "Director debut must be. Ex:- 0 or 1";
      }

      // Optional numeric
      if (
        payload.nom_reels_tapes &&
        !validator.isNumeric(String(payload.nom_reels_tapes))
      ) {
        errors.nom_reels_tapes = "Nom reels/tapes must be numeric.";
      }

      // Regex match
      const ratioRegex = /^\d+(:\d+)?$/;

      if (!payload.aspect_ratio || !ratioRegex.test(payload.aspect_ratio)) {
        errors.aspect_ratio = "Aspect ratio must be like. Ex:- 10:10 or 10";
      }

      if (!payload.running_time || !ratioRegex.test(payload.running_time)) {
        errors.running_time = "Runing time must be like. Ex:- 10:10 or 10";
      }

      // Enum values
      if (!["1", "2", "3"].includes(String(payload.format))) {
        errors.format = "Format must be one of 1, 2, 3.";
      }

      if (!["1", "2", "3", "4"].includes(String(payload.sound_system))) {
        errors.sound_system = "Sound system must be one of 1, 2, 3, 4.";
      }

      if (!["1", "2"].includes(String(payload.color_bw))) {
        errors.color_bw = "Color Black/white must be. Ex:- 1 or 2";
      }

      // Optional string
      if (payload.film_synopsis && typeof payload.film_synopsis === "string") {
        const wordCount = payload.film_synopsis.trim().split(/\s+/).length;
        if (wordCount > 150) {
          errors.film_synopsis = "Film synopsis must not exceed 150 words.";
        }
      }
    }

    //CENSOR
    if (String(step) === String(CONSTANT.stepsFeature().CENSOR)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (!payload.censor_certificate_nom?.trim()) {
        errors.censor_certificate_nom =
          "Censor Certificate Number is required.";
      }

      if (
        !payload.censor_certificate_date ||
        !validator.isDate(payload.censor_certificate_date, {
          format: "YYYY-MM-DD",
          strictMode: true,
        })
      ) {
        errors.censor_certificate_date =
          "Censor Certificate Date is required and must be in YYYY-MM-DD format.";
      }

      // Additional check: Ensure the date isn't in the future
      const certificateDate = new Date(payload.censor_certificate_date);
      const today = new Date();
      if (certificateDate > today) {
        errors.censor_certificate_date =
          "Censor Certificate Date cannot be in the future.";
      }

      const censorFile = files?.find(
        (file) => file.fieldname === "censor_certificate_file"
      );

      if (censorFile) {
        if (typeof censorFile !== "object" || !censorFile.mimetype) {
          errors.censor_certificate_file =
            "Censor Certificate must be a valid file.";
        }
      }
    }

    // More step cases...

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

module.exports = NfaFeatureHelper;
