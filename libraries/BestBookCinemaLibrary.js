const Joi = require("joi");

const BestBookCinemaLibrary = {
  // consumeCOMPANYREGISTRATION: (payload) => {
  //   const censorFile = payload.files?.find(
  //     (file) => file.fieldname === "company_reg_doc"
  //   );
  //   const consumeCensor = {
  //     last_id: payload.last_id,
  //     company_reg_details: payload.company_reg_details || null,
  //     company_reg_doc: censorFile,
  //     title_registratin_detils: payload.title_registratin_detils || null,
  //   };
  //   return consumeCensor;
  // },

  consumeBESTBOOKONCINEMA: (payload) => {
    return {
      client_id: payload.user.id,
      last_id: payload.last_id ?? null,
    };
  },

  consumeAUTHOR: (payload) => {
    const authorAadhaar = payload.files?.find(
      (file) => file.fieldname === "author_aadhaar_card"
    );
    const consumeAuthor = {
      last_id: payload.last_id,
      author_name: payload.author_name || null,
      author_contact: payload.author_contact || null,
      author_address: payload.author_address || null,
      author_nationality_indian: payload.author_nationality_indian || null,
      author_profile: payload.author_profile || null,
      author_aadhaar_card: authorAadhaar,
    };
    return consumeAuthor;
  },

  consumePUBLISHEREDITOR: (payload) => {
    return {
      last_id: payload.last_id,
    };
  },

  consumeDECLARATION: (payload) => {
    const consumeOTHER = {
      last_id: payload.last_id,
      declaration_one: payload.declaration_one || null,
      declaration_two: payload.declaration_two || null,
      declaration_three: payload.declaration_three || null,
    };
    return consumeOTHER;
  },
};

module.exports = BestBookCinemaLibrary;
