const responseHelper = require("../helpers/responseHelper");
const SongSchema = require("../helpers/songSchema");
const { NfaFeature } = require("../models/NfaFeature");
const { Song } = require("../models/Song");

const SongController = {
  storeSong: async (req, res) => {
    const { isValid, errors } = SongSchema.validateStore(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      nfaFeature = await NfaFeature.findOne({
        where: { id: payload.nfa_feature_id, client_id: payload.user.id },
      });
      if (!nfaFeature) {
        return responseHelper(res, "noresult");
      }

      arrayToInsert = {
        nfa_feature_id: payload.nfa_feature_id ?? null,
        song_title: payload.song_title ?? null,
        music_director: payload.music_director ?? null,
        music_director_bkgd_music: payload.music_director_bkgd_music ?? null,
        lyricist: payload.lyricist ?? null,
        playback_singer_male: payload.playback_singer_male ?? null,
        playback_singer_female: payload.playback_singer_female ?? null,
      };

      song = await Song.create(arrayToInsert);

      if (!song) {
        return responseHelper(res, "noresult", {
          message: "Song not created.!!",
        });
      }
      return responseHelper(res, "created", {
        message: "Song created successfully.!!",
        data: song,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateSong: async (req, res) => {
    const { isValid, errors } = SongSchema.validateUpdate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      song = await Song.findOne({ where: { id: payload.id } });

      if (song) {
        if (payload.nfa_feature_id !== undefined) {
          nfaFeature = await NfaFeature.findOne({
            where: { id: payload.nfa_feature_id, client_id: payload.user.id },
          });

          if (!nfaFeature) {
            return responseHelper(res, "noresult");
          }
        }

        arrayToUpdate = {
          nfa_feature_id: payload.nfa_feature_id ?? song.nfa_feature_id,
          song_title: payload.song_title ?? song.song_title,
          music_director: payload.music_director ?? song.music_director,
          music_director_bkgd_music:
            payload.music_director_bkgd_music ?? song.music_director_bkgd_music,
          lyricist: payload.lyricist ?? song.lyricist,
          playback_singer_male:
            payload.playback_singer_male ?? song.playback_singer_male,
          playback_singer_female:
            payload.playback_singer_female ?? song.playback_singer_female,
        };

        songUpdate = await song.update(arrayToUpdate);
        if (songUpdate) {
          return responseHelper(res, "success", {
            message: "Song updated successfully.!!",
            data: songUpdate,
          });
        } else {
          responseHelper(res, "updateError");
        }
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  listSong: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      nfaFeature = NfaFeature.findOne({
        where: { id: payload.feature_id, client_id: payload.user.id },
      });
      if (!nfaFeature) {
        responseHelper(res, "noresult");
      }
      songList = await Song.findAll({
        where: { nfa_feature_id: payload.feature_id },
      });
      if (songList.length > 0) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: songList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  getSong: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      songList = await Song.findOne({
        where: { id: payload.id },
      });
      if (songList) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: songList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  deleteSong: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      song = await Song.findOne({
        where: { id: payload.id },
      });
      if (song) {
        song.destroy();
        responseHelper(res, "success", {
          message: "Records deleted successfully.!!",
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },
};
module.exports = SongController;
