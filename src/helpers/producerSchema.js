var validator = require("validator");

const ProducerSchema = {
  //   validateStore: (data) => {
  //     const errors = {};

  //     if (!data.nfa_feature_id || validator.isEmpty(data.nfa_feature_id.trim())) {
  //       errors.nfa_feature_id = "Nfafeature id is required.!!";
  //     }

  //     if (
  //       !data.nfa_non_feature_id ||
  //       validator.isEmpty(data.nfa_non_feature_id.trim())
  //     ) {
  //       errors.nfa_non_feature_id = "Nfanonfeature id is required.!!";
  //     }

  //     if (
  //       !payload.indian_national ||
  //       validator.isEmpty(payload.indian_national.trim())
  //     ) {
  //       errors.indian_national = "Nationality is required.!!";
  //     } else if (!["0", "1", 0, 1].includes(payload.indian_national)) {
  //       errors.indian_national = "Nationality must be 0 OR 1.!!";
  //     }

  //     if (!data.name || validator.isEmpty(data.name.trim())) {
  //       errors.name = "Producer name is required.!!";
  //     }

  //     if (!data.email || validator.isEmpty(String(data.email).trim())) {
  //       errors.email = "Email is required.!!";
  //     } else if (!validator.isEmail(String(data.email).trim())) {
  //       errors.email = "Invalid email format";
  //     }

  //     if (!data.contact_nom || validator.isEmpty(data.contact_nom.trim())) {
  //       errors.contact_nom = "Contact nomber is required";
  //     } else if (!validator.isMobilePhone(data.mobile, "en-IN")) {
  //       errors.contact_nom =
  //         "Contact nomber must be a valid 10-digit Indian number";
  //     }

  //     if (!data.address || validator.isEmpty(data.address.trim())) {
  //       errors.address = "Address is required";
  //     }

  //     const producerDoc = files?.find(
  //       (file) => file.fieldname === "producer_self_attested_doc"
  //     );

  //     if (producerDoc) {
  //       if (typeof censorFile !== "object" || !censorFile.mimetype) {
  //         errors.producer_self_attested_doc =
  //           "Censor Certificate must be a valid file.";
  //       }
  //     }

  //     return {
  //       isValid: Object.keys(errors).length === 0,
  //       errors,
  //     };
  //   },

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
};
module.exports = ProducerSchema;
