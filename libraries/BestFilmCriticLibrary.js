const BestFilmCriticLibrary = {
  consumeCRITICDETAILS: (payload) => {
    const consumeCritic = {
      client_id: payload.user.id,
      last_id: payload.last_id ?? null,
      critic_name: payload.critic_name || null,
      critic_address: payload.critic_address || null,
      critic_contact: payload.critic_contact || null,
      nationality: payload.nationality || null,
      critic_profile: payload.critic_profile || null,
    };
    return consumeCritic;
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
