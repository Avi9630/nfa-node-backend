const { string } = require("joi");
var validator = require("validator");

const ProducerSchema = {
  validateStore: (data, files) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.nfa_feature_id && !trimmedData.nfa_non_feature_id) {
      errors.nfa_feature_id =
        "Either NFA feature ID or NFA non-feature ID is required!";
      errors.nfa_non_feature_id =
        "Either NFA feature ID or NFA non-feature ID is required!";
    }

    if (!trimmedData.indian_national) {
      errors.indian_national = "Nationality is required!";
    } else if (!["0", "1"].includes(trimmedData.indian_national)) {
      errors.indian_national = "Nationality must be 0 or 1!";
    }

    if (
      trimmedData.receive_producer_award !== undefined &&
      trimmedData.receive_producer_award !== null &&
      !["1", 1].includes(trimmedData.receive_producer_award)
    ) {
      errors.receive_producer_award =
        "Receive producer award must be Yes(1) if provided.";
    }

    if (trimmedData.indian_national === "0") {
      if (!trimmedData.country_of_nationality) {
        errors.country_of_nationality = "Country of nationality is required!";
      }
    }

    if (!trimmedData.name) {
      errors.name = "Producer name is required!";
    }

    if (!trimmedData.email) {
      errors.email = "Email is required!";
    } else if (!validator.isEmail(trimmedData.email)) {
      errors.email = "Invalid email format!";
    }

    if (!trimmedData.contact_nom) {
      errors.contact_nom = "Contact number is required!";
    } else if (!validator.isMobilePhone(trimmedData.contact_nom, "en-IN")) {
      errors.contact_nom =
        "Contact number must be a valid 10-digit Indian number!";
    }

    if (!trimmedData.pincode || validator.isEmpty(trimmedData.pincode.trim())) {
      errors.pincode = "Pincode is required";
    } else if (!validator.matches(trimmedData.pincode, /^\d{6}$/)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    if (!trimmedData.address) {
      errors.address = "Address is required!";
    }

    const producerDoc = files?.find(
      (file) => file.fieldname === "producer_self_attested_doc"
    );

    if (!producerDoc) {
      errors.producer_self_attested_doc =
        "Producer self-attested document is required!";
    } else if (!producerDoc.mimetype.startsWith("application/")) {
      errors.producer_self_attested_doc =
        "Invalid file format for producer self-attested document!";
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

    if (trimmedData.indian_national === "0") {
      if (!trimmedData.country_of_nationality) {
        errors.country_of_nationality = "Country of nationality is required!";
      }
    }

    if (
      trimmedData.receive_producer_award !== undefined &&
      trimmedData.receive_producer_award !== null &&
      !["1", 1].includes(trimmedData.receive_producer_award)
    ) {
      errors.receive_producer_award =
        "Receive producer award must be Yes(1) if provided.";
    }

    if (
      trimmedData.indian_national !== undefined &&
      trimmedData.indian_national !== null &&
      !["0", "1", 0, 1].includes(trimmedData.indian_national)
    ) {
      errors.indian_national = "Indian national must be 0 OR 1.!!";
    }

    if (
      trimmedData.email !== undefined &&
      trimmedData.email !== null &&
      !validator.isEmail(trimmedData.email)
    ) {
      errors.email = "Invalid email format!";
    }

    if (
      trimmedData.contact_nom &&
      typeof trimmedData.contact_nom === "string" &&
      !validator.isMobilePhone(trimmedData.contact_nom, "en-IN")
    ) {
      errors.contact_nom = "Mobile must be a valid 10-digit Indian number";
    }

    if (!validator.matches(trimmedData.pincode, /^\d{6}$/)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    const producerDoc = files?.find(
      (file) => file.fieldname === "producer_self_attested_doc"
    );

    if (producerDoc) {
      if (!producerDoc.mimetype.startsWith("application/")) {
        errors.producer_self_attested_doc =
          "Invalid file format! Only document files are allowed.";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = ProducerSchema;
