const Joi = require("joi");

const NfaNonFeatureLibrary = {
  consumeGENERAL: (payload) => {
    if (typeof payload.language_id === "object") {
      languageIds = JSON.stringify(payload.language_id);
    }
    return {
      client_id: payload.user.id,
      film_title_roman: payload.film_title_roman,
      film_title_devnagri: payload.film_title_devnagri,
      film_title_english: payload.film_title_english,
      language_id: languageIds,
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

  consumeCOMPANYREGISTRATION: (payload) => {
    const censorFile = payload.files?.find(
      (file) => file.fieldname === "company_reg_doc"
    );
    const consumeCensor = {
      last_id: payload.last_id,
      company_reg_details: payload.company_reg_details || null,
      company_reg_doc: censorFile,
      title_registratin_detils: payload.title_registratin_detils || null,
    };
    return consumeCensor;
  },

  consumePRODUCER: (payload) => {
    return payload;
  },

  consumeDIRECTOR: (payload) => {
    return payload;
  },

  consumeACTORS: (payload) => {
    return payload;
  },

  consumeSONGS: (payload) => {
    return payload;
  },

  consumeAUDIOGRAPHER: (payload) => {
    return payload;
  },

  consumeOTHER: (payload) => {
    const originalWorkCopyFile = payload.files?.find(
      (file) => file.fieldname === "original_work_copy"
    );
    const consumeOTHER = {
      last_id: payload.last_id,
      original_screenplay_name: payload.original_screenplay_name || null,
      adapted_screenplay_name: payload.adapted_screenplay_name || null,
      story_writer_name: payload.story_writer_name || null,
      work_under_public_domain: payload.work_under_public_domain || null,
      original_work_copy: originalWorkCopyFile,
      dialogue: payload.dialogue || null,
      cinemetographer: payload.cinemetographer || null,
      editor: payload.editor || null,
      costume_designer: payload.costume_designer || null,
      animator: payload.animator || null,
      stunt_choreographer: payload.stunt_choreographer || null,
      music_director: payload.music_director || null,
      special_effect_creator: payload.special_effect_creator || null,
      shot_digital_video_format: payload.shot_digital_video_format || null,
      production_designer: payload.production_designer || null,
      make_up_director: payload.make_up_director || null,
      choreographer: payload.choreographer || null,
    };
    return consumeOTHER;
  },

  consumeRETURNADDRESS: (payload) => {
    const consumeOTHER = {
      last_id: payload.last_id,
      return_name: payload.return_name || null,
      return_email: payload.return_email || null,
      return_mobile: payload.return_mobile || null,
      return_address: payload.return_address || null,
      return_pincode: payload.return_pincode,
      return_fax: payload.return_fax || null,
      return_website: payload.return_website || null,
    };
    return consumeOTHER;
  },

  consumeDECLARATION: (payload) => {
    const consumeOTHER = {
      last_id: payload.last_id,
      declaration_one: payload.declaration_one || null,
      declaration_two: payload.declaration_two || null,
      declaration_three: payload.declaration_three || null,
      declaration_four: payload.declaration_four || null,
      declaration_five: payload.declaration_five,
      declaration_six: payload.declaration_six || null,
      declaration_seven: payload.declaration_seven || null,
      declaration_eight: payload.declaration_eight || null,
    };
    return consumeOTHER;
  },
};

module.exports = NfaNonFeatureLibrary;
