var validator = require("validator");

const SongSchema = {
  validateStore: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (
      !trimmedData.nfa_feature_id ||
      !validator.isInt(trimmedData.nfa_feature_id)
    ) {
      errors.nfa_feature_id =
        "NFA feature ID is required.!! && must be number.!!";
    }

    if (!trimmedData.song_title) {
      errors.song_title = "Song title is required.!!";
    }

    if (!trimmedData.music_director) {
      errors.music_director = "Music director is required.!!";
    }

    if (!trimmedData.music_director_bkgd_music) {
      errors.music_director_bkgd_music =
        "Music director background music is required.!!";
    }

    if (!trimmedData.lyricist) {
      errors.lyricist = "Lyricist is required.!!";
    }

    if (!trimmedData.playback_singer_male) {
      errors.playback_singer_male = "Plackback singer male is required.!!";
    }

    if (!trimmedData.playback_singer_female) {
      errors.playback_singer_female = "Playback singer female is required.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateUpdate: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    if (!trimmedData.id || isNaN(String(trimmedData.id))) {
      errors.id = "ID is required and must be a number.!!";
    }

    if (
      trimmedData.nfa_feature_id !== undefined &&
      trimmedData.nfa_feature_id !== null &&
      !validator.isInt(trimmedData.nfa_feature_id)
    ) {
      errors.nfa_feature_id = "NFA feature should be integer if provided.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateListSong: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

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

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};
module.exports = SongSchema;
