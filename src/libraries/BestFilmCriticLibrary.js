const BestFilmCriticLibrary = {
  consumeBESTFILMCRITIC: (payload) => {
    const data = {};

    data.client_id = payload.user.id;
    data.last_id = payload.last_id ?? null;
    data.writer_name = payload.writer_name;
    data.article_title = payload.article_title;

    if (typeof payload.article_language_id === "object") {
      data.article_language_id = JSON.stringify(payload.article_language_id);
    } else if (typeof payload.article_language_id === "string") {
      let decoded;
      try {
        decoded = JSON.parse(payload.article_language_id);
        if (!Array.isArray(decoded)) {
          decoded = [decoded];
        }
      } catch (e) {
        decoded = payload.article_language_id
          .split(",")
          .map((item) => item.trim());
      }
      data.article_language_id = JSON.stringify(decoded);
    }

    data.publication_date = payload.publication_date;
    data.publication_name = payload.publication_name;
    data.rni = payload.rni;
    data.rni_registration_no =
      payload.rni_registration_no && payload.rni_registration_no.trim() !== ""
        ? payload.rni_registration_no
        : null;
    return data;
  },

  consumeCRITIC: (payload) => {
    const criticAadhaar = payload.files?.find(
      (file) => file.fieldname === "critic_aadhaar_card"
    );
    const consumeCritic = {
      last_id: payload.last_id,
      critic_name: payload.critic_name || null,
      critic_address: payload.critic_address || null,
      critic_contact: payload.critic_contact || null,
      critic_indian_nationality: payload.critic_indian_nationality || null,
      critic_profile: payload.critic_profile || null,
      critic_aadhaar_card: criticAadhaar,
    };
    return consumeCritic;
  },

  consumePUBLISHER: (payload) => {
    return {
      last_id: payload.last_id,
    };
  },

  consumeDECLARATION: (payload) => {
    return {
      last_id: payload.last_id,
      declaration_one: payload.declaration_one || null,
      declaration_two: payload.declaration_two || null,
      declaration_three: payload.declaration_three || null,
    };
  },
};

module.exports = BestFilmCriticLibrary;
