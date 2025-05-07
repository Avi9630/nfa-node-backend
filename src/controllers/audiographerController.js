const AudiographerSchema = require("../helpers/audiographerSchema");
const responseHelper = require("../helpers/responseHelper");
const { Audiographer } = require("../models/Audiographer");
const { NfaFeature } = require("../models/NfaFeature");

const AudiographerController = {
  storeAudiographer: async (req, res) => {
    const { isValid, errors } = AudiographerSchema.validateStore(req.body);

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
        production_sound_recordist: payload.production_sound_recordist ?? null,
        sound_designer: payload.sound_designer ?? null,
        re_recordist_filnal: payload.re_recordist_filnal ?? null,
      };

      audiographer = await Audiographer.create(arrayToInsert);

      if (!audiographer) {
        return responseHelper(res, "noresult", {
          message: "Audiographer not created.!!",
        });
      }
      return responseHelper(res, "created", {
        message: "Audiographer created successfully.!!",
        data: audiographer,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateAudiographer: async (req, res) => {
    const { isValid, errors } = AudiographerSchema.validateUpdate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      audiographer = await Audiographer.findOne({ where: { id: payload.id } });

      if (audiographer) {
        if (payload.nfa_feature_id !== undefined) {
          nfaFeature = await NfaFeature.findOne({
            where: { id: payload.nfa_feature_id, client_id: payload.user.id },
          });

          if (!nfaFeature) {
            return responseHelper(res, "noresult");
          }
        }

        arrayToUpdate = {
          nfa_feature_id: payload.nfa_feature_id ?? audiographer.nfa_feature_id,

          production_sound_recordist:
            payload.production_sound_recordist ??
            audiographer.production_sound_recordist,
          sound_designer: payload.sound_designer ?? audiographer.sound_designer,
          re_recordist_filnal:
            payload.re_recordist_filnal ?? audiographer.re_recordist_filnal,
        };

        audiographerUpdate = await audiographer.update(arrayToUpdate);
        if (audiographerUpdate) {
          return responseHelper(res, "success", {
            message: "Audiographer updated successfully.!!",
            data: audiographerUpdate,
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

  listAudiographer: async (req, res) => {
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
      audiographerList = await Audiographer.findAll({
        where: { nfa_feature_id: payload.feature_id },
      });
      if (audiographerList.length > 0) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: audiographerList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  getAudiographer: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      audiographerList = await Audiographer.findOne({
        where: { id: payload.id },
      });
      if (audiographerList) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: audiographerList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  deleteAudiographer: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      audiographer = await Audiographer.findOne({
        where: { id: payload.id },
      });
      if (audiographer) {
        audiographer.destroy();
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
module.exports = AudiographerController;
