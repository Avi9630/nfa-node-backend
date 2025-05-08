const responseHelper = require("../helpers/responseHelper");
const BestBookCinemaHelper = require("../helpers/bestBookCinemaHelper");
const { BestBookCinema } = require("../models/BestBookCinema");

const BestBookCinemaController = {
  Entry: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = BestBookCinemaHelper.validateStepInput(
      req.body,
      files
    );

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
        files: req.files,
      };

      const data = await BestBookCinema.consumeRecords(payload);
      data.step = payload.step;

      console.log(data);
      return "From Controller";

      const user = await Client.findOne({ where: { id: payload.user.id } });
      if (user.usertype !== 1) {
        responseHelper(res, "notvalid", {
          message: "You are not a valid user to fill this form.!!",
        });
      }

      const stepHandlers = {
        [CONSTANT.stepsFeature().GENRAL]: async (data, payload) =>
          await nfaFeatureController.handleGeneralStep(data, payload),

        [CONSTANT.stepsFeature().CENSOR]: async (data, payload) =>
          await nfaFeatureController.handleCensorStep(data, payload),

        [CONSTANT.stepsFeature().COMPANY_REGISTRATION]: async (data, payload) =>
          await nfaFeatureController.handleCompanyRegistrationStep(
            data,
            payload
          ),

        [CONSTANT.stepsFeature().PRODUCER]: async (data, payload) =>
          await nfaFeatureController.handleProducerStep(data, payload),

        [CONSTANT.stepsFeature().DIRECTOR]: async (data, payload) =>
          await nfaFeatureController.handleDirectorStep(data, payload),

        [CONSTANT.stepsFeature().ACTORS]: async (data, payload) =>
          await nfaFeatureController.handleActorsStep(data, payload),

        [CONSTANT.stepsFeature().SONGS]: async (data, payload) =>
          await nfaFeatureController.handleSongsStep(data, payload),

        [CONSTANT.stepsFeature().AUDIOGRAPHER]: async (data, payload) =>
          await nfaFeatureController.handleAudiographerStep(data, payload),

        [CONSTANT.stepsFeature().OTHER]: async (data, payload) =>
          await nfaFeatureController.handleOtherStep(data, payload),

        [CONSTANT.stepsFeature().RETURN_ADDRESS]: async (data, payload) =>
          await nfaFeatureController.handleReturnAddressStep(data, payload),

        [CONSTANT.stepsFeature().DECLARATION]: async (data, payload) =>
          await nfaFeatureController.handleDeclarationStep(data, payload),
      };

      if (stepHandlers[data.step]) {
        const result = await stepHandlers[data.step](data, payload);

        if (result?.status === "created") {
          return responseHelper(res, "created", {
            message: result?.data?.message || "Created successfully.",
            data: result?.data?.record || result.data,
          });
        }

        if (result?.status === "updateError") {
          return responseHelper(res, "updateError", {
            message: result?.message || "Error while Updating!",
            data: result?.data?.record || result.data,
          });
        }

        if (result?.status === "exception") {
          return responseHelper(res, "exception", {
            message: result?.message,
            errors: result?.error || {},
          });
        }
        return responseHelper(res, "success", { data: result });
      }

      responseHelper(res, "badrequest", {
        message: "Invalid step provided.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = BestBookCinemaController;
