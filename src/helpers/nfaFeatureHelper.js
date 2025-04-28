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

    //COMPANY REGISTRATION
    if (String(step) === String(CONSTANT.stepsFeature().COMPANY_REGISTRATION)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (
        !payload.company_reg_details ||
        validator.isEmpty(payload.company_reg_details.trim())
      ) {
        errors.company_reg_details =
          "Company registration details field is required.";
      }

      const censorFile = files?.find(
        (file) => file.fieldname === "company_reg_doc"
      );

      if (censorFile) {
        if (typeof censorFile !== "object" || !censorFile.mimetype) {
          errors.company_reg_doc = "Company register doc must be a valid file.";
        }
      }
    }

    //OTHERS
    if (String(step) === String(CONSTANT.stepsFeature().OTHER)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (
        !payload.original_screenplay_name ||
        validator.isEmpty(payload.original_screenplay_name.trim())
      ) {
        errors.original_screenplay_name =
          "Original screenplay name is required.";
      }

      if (
        !payload.adapted_screenplay_name ||
        validator.isEmpty(payload.adapted_screenplay_name.trim())
      ) {
        errors.adapted_screenplay_name = "Adapted screenplay name is required.";
      }

      if (
        !payload.story_writer_name ||
        validator.isEmpty(payload.story_writer_name.trim())
      ) {
        errors.story_writer_name = "Story writer name is required.";
      }

      if (
        payload.work_under_public_domain !== undefined &&
        payload.work_under_public_domain !== null &&
        !["1", "2", 1, 2].includes(payload.work_under_public_domain)
      ) {
        errors.work_under_public_domain =
          "Public domain must be 1 or 2 if provided.";
      }

      if (
        payload.shot_digital_video_format !== undefined &&
        payload.shot_digital_video_format !== null &&
        !["1", "2", 1, 2].includes(payload.shot_digital_video_format)
      ) {
        errors.shot_digital_video_format =
          "Short digital must be 1 or 2 if provided.";
      }

      const censorFile = files?.find(
        (file) => file.fieldname === "original_work_copy"
      );

      if (censorFile) {
        if (typeof censorFile !== "object" || !censorFile.mimetype) {
          errors.original_work_copy = "Work copy must be a valid file.";
        }
      }
    }

    //RETURN_ADDRESS
    if (String(step) === String(CONSTANT.stepsFeature().RETURN_ADDRESS)) {
      if (!payload.last_id || isNaN(payload.last_id)) {
        errors.last_id = "Last ID is required and must be a number.";
      }

      if (
        !payload.return_name ||
        validator.isEmpty(payload.return_name.trim())
      ) {
        errors.return_name = "Return name is required.";
      }

      if (
        !payload.return_email ||
        validator.isEmpty(String(payload.return_email).trim())
      ) {
        errors.return_email = "Return email is required";
      } else if (!validator.isEmail(String(payload.return_email).trim())) {
        errors.return_email = "Invalid return email format";
      }

      if (
        !payload.return_mobile ||
        validator.isEmpty(payload.return_mobile.trim())
      ) {
        errors.return_mobile = "Mobile is required";
      } else if (!validator.isMobilePhone(payload.return_mobile, "en-IN")) {
        errors.return_mobile = "Mobile must be a valid 10-digit Indian number";
      }

      if (
        !payload.return_address ||
        validator.isEmpty(payload.return_address.trim())
      ) {
        errors.return_address = "Return address is required.";
      }

      if (
        !payload.return_pincode ||
        validator.isEmpty(payload.return_pincode.trim())
      ) {
        errors.return_pincode = "Return pincode is required";
      } else if (!validator.matches(payload.return_pincode, /^\d{6}$/)) {
        errors.return_pincode = "Return pincode must be 6 digits";
      }

      if (payload.return_fax !== undefined && payload.return_fax !== null) {
        errors.return_fax = "Return fax must be valid input.!!";
      }

      if (
        payload.return_website !== undefined &&
        payload.return_website !== null
      ) {
        errors.return_website = "Return website must be valid input.!!";
      }
    }

    //DECLARATION
    if (String(step) === String(CONSTANT.stepsFeature().DECLARATION)) {
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
      if (!["1", 1].includes(payload.declaration_four)) {
        errors.declaration_four = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_five)) {
        errors.declaration_five = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_six)) {
        errors.declaration_six = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_seven)) {
        errors.declaration_seven = "Declaration is must be Yes(1).!!";
      }
      if (!["1", 1].includes(payload.declaration_eight)) {
        errors.declaration_eight = "Declaration is must be Yes(1).!!";
      }
    }

    // More steps to go

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

module.exports = NfaFeatureHelper;
