const responseHelper = require("../helpers/responseHelper");
const NfaFeatureHelper = require("../helpers/nfaFeatureHelper");
const { NfaFeature } = require("../models/NfaFeature");
const { Client } = require("../models/Client");
const CONSTANT = require("../libraries/Constant");

const nfaFeatureController = {
  Entry: async (req, res) => {
    const payload = req.body;
    // const payload = {
    //   ...req.body,
    //   user: req.user,
    // };

    // if (
    //   payload.film_synopsis &&
    //   payload.film_synopsis.split(/\s+/).length > 150
    // ) {
    //   return res.status(422).json({
    //     status: "error",
    //     message: "The film synopsis must not exceed 150 words.",
    //   });
    // }

    const { validatorSchema, messages } = await NfaFeature.validateData(
      payload
    );
    const { error } = validatorSchema.validate(payload, { abortEarly: false });

    if (error) {
      responseHelper(res, "validatorerrors", {
        message: error.details.reduce((acc, curr) => {
          acc[curr.context.key] = curr.message;
          return acc;
        }, {}),
      });
    }

    try {
      const user = req.user;
      const data = await NfaFeature.consumeRecords(payload, user);
      data.step = payload.step;

      if (data.step === 1) {
        const user = await Client.findOne({ where: { id: data.client_id } });
        if (user.usertype !== 1) {
          responseHelper(res, "notvalid", {
            message: "You are not a valid user to fill this form.!!",
          });
        }
      }

      const stepHandlers = {
        [CONSTANT.stepsFeature().GENRAL]: async (data, payload, user) =>
          await nfaFeatureController.handleGeneralStep(data, payload, user),

        [CONSTANT.stepsFeature().CENSOR]: async (data, payload, user) =>
          await handleCensorStep(data, payload, user),

        [CONSTANT.stepsFeature().COMPANY_REGISTRATION]: async (
          data,
          payload,
          user
        ) => await handleCompanyRegistrationStep(data, payload, user),

        [CONSTANT.stepsFeature().PRODUCER]: async (data, payload, user) =>
          await handleProducerStep(data, payload, user),

        [CONSTANT.stepsFeature().DIRECTOR]: async (data, payload, user) =>
          await handleDirectorStep(data, payload, user),

        [CONSTANT.stepsFeature().ACTORS]: async (data, payload, user) =>
          await handleActorsStep(data, payload, user),

        [CONSTANT.stepsFeature().SONGS]: async (data, payload, user) =>
          await handleSongsStep(data, payload, user),

        [CONSTANT.stepsFeature().AUDIOGRAPHER]: async (data, payload, user) =>
          await handleAudiographerStep(data, payload, user),

        [CONSTANT.stepsFeature().OTHER]: async (data, payload, user) =>
          await handleOtherStep(data, payload, user),

        [CONSTANT.stepsFeature().RETURN_ADDRESS]: async (data, payload, user) =>
          await handleReturnAddressStep(data, payload, user),

        [CONSTANT.stepsFeature().DECLARATION]: async (data, payload, user) =>
          await handleDeclarationStep(data, payload, user),
      };

      if (stepHandlers[data.step]) {
        // return await stepHandlers[data.step](payload, data, req.user.id);
        const result = await stepHandlers[data.step](
          payload,
          data,
          req.user.id
        );

        // if (result?.status === "created") {
        //   // responseHelper(res, `'${result?.status}'`, { result });
        //   return res.status(201).json(result.data);
        // }
        // if (result?.status === "exception") {
        //   return res.status(422).json(result.data);
        // }

        if (result?.status === "created") {
          return responseHelper(res, "created", {
            message: result?.data?.message || "Created successfully.",
            data: result?.data?.record || result.data,
          });
        }

        if (result?.status === "exception") {
          return responseHelper(res, "unprocessable", {
            message:
              result?.data?.message || "There was an issue with your request.",
            errors: result?.data?.errors || {},
          });
        }
        return res.status(200).json(result);
      }

      responseHelper(res, "badrequest", { message: "Invalid step provided" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  handleGeneralStep: async (data, payload, user) => {
    const lastId = payload.last_id || null;

    if (lastId) {
      console.log("Hii");

      const checkForm = await NfaFeatureModel.findOne({
        where: { client_id: data.client_id, id: lastId },
      });

      if (!checkForm) {
        return {
          status: "exception",
          data: { message: "Please provide valid details to update.!!" },
        };
      }

      if (
        !checkForm.active_step ||
        checkForm.active_step < CONSTANT.stepsFeature().GENRAL
      ) {
        data.active_step = CONSTANT.stepsFeature().GENRAL;
      }

      return await NfaFeature.updateOrCreateFeature(lastId, data);
    }

    payload.active_step = payload.step;
    create = await NfaFeature.createFeature(payload);
    return {
      status: "created",
      data: { message: "Feature form created.!!", record: create },
    };
  },

  handleCensorStep: async (data, payload, user) => {
    console.log("From handleCensorStep Step");
  },

  handleCompanyRegistrationStep: async (data, payload, user) => {
    console.log("From handleCompanyRegistrationStep  Step");
  },

  handleProducerStep: async (data, payload, user) => {
    console.log("From handleProducerStep  Step");
  },

  handleDirectorStep: async (data, payload, user) => {
    console.log("From handleDirectorStep  Step");
  },

  handleActorsStep: async (data, payload, user) => {
    console.log("From handleActorsStep  Step");
  },

  handleSongsStep: async (data, payload, user) => {
    console.log("From handleSongsStep  Step");
  },

  handleAudiographerStep: async (data, payload, user) => {
    console.log("From handleAudiographerStep  Step");
  },

  handleOtherStep: async (data, payload, user) => {
    console.log("From handleOtherStep  Step");
  },

  handleReturnAddressStep: async (data, payload, user) => {
    console.log("From handleReturnAddressStep  Step");
  },

  handleDeclarationStep: async (data, payload, user) => {
    console.log("From handleDeclarationStep  Step");
  },
};

module.exports = nfaFeatureController;
