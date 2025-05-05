const responseHelper = require("../helpers/responseHelper");
const { NfaFeature } = require("../models/NfaFeature");
const ActorSchema = require("../helpers/actorSchema");
// const knex = require("knex")(require("../knexfile"));
const { Actor } = require("../models/Actor");

const ActorController = {
  storeActor: async (req, res) => {
    const { isValid, errors } = ActorSchema.validateStore(req.body);

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
        actor_category_id: payload.actor_category_id,
        name: payload.name,
        screen_name: payload.screen_name,
        if_voice_dubbed: payload.if_voice_dubbed,
      };

      actor = await Actor.create(arrayToInsert);

      if (!actor) {
        return responseHelper(res, "noresult", {
          message: "Actor not created.!!",
        });
      }
      return responseHelper(res, "created", {
        message: "Producer created successfully.!!",
        data: actor,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateActor: async (req, res) => {
    const { isValid, errors } = ActorSchema.validateUpdate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      actor = await Actor.findOne({ where: { id: payload.id } });

      if (actor) {
        if (payload.nfa_feature_id !== undefined) {
          nfaFeature = await NfaFeature.findOne({
            where: { id: payload.nfa_feature_id, client_id: payload.user.id },
          });

          if (!nfaFeature) {
            return responseHelper(res, "noresult");
          }
        }

        arrayToUpdate = {
          nfa_feature_id: payload.nfa_feature_id ?? actor.nfa_feature_id,
          actor_category_id:
            payload.actor_category_id ?? actor.actor_category_id,
          name: payload.name ?? actor.name,
          screen_name: payload.screen_name ?? actor.screen_name,
          if_voice_dubbed: payload.if_voice_dubbed ?? actor.if_voice_dubbed,
        };

        actorUpdate = await actor.update(arrayToUpdate);
        if (actorUpdate) {
          return responseHelper(res, "success", {
            message: "Actor updated successfully.!!",
            data: actorUpdate,
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

  listActor: async (req, res) => {
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
      actorList = await Actor.findAll({
        where: { nfa_feature_id: payload.feature_id },
      });
      if (actorList.length > 0) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: actorList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  getActor: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      actorList = await Actor.findOne({
        where: { id: payload.id },
      });
      if (actorList) {
        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: actorList,
        });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },

  deleteActor: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      actor = await Actor.findOne({
        where: { id: payload.id },
      });
      if (actor) {
        actor.destroy();
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

  //   allActorCategory: async (req, res) => {
  //     try {
  //       const actorCategory = await knex("actor_category").select("id", "name");

  //       if (actorCategory.length > 0) {
  //         responseHelper(res, "success", {
  //           message: "Actor category fetched successfully!",
  //           data: actorCategory,
  //         });
  //       } else {
  //         responseHelper(res, "notvalid");
  //       }
  //     } catch (errors) {
  //       responseHelper(res, "exception", { message: errors.message });
  //     }
  //   },
};

module.exports = ActorController;
