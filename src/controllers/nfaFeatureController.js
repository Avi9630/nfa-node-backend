const responseHelper = require("../helpers/responseHelper");
const { NfaFeature } = require("../models/NfaFeature");
const { Client } = require("../models/Client");
const ImageLib = require("../libraries/ImageLib");
const CONSTANT = require("../libraries/Constant");
const NfaFeatureHelper = require("../helpers/nfaFeatureHelper");

const nfaFeatureController = {
  // Entry: async (req, res) => {
  //   const payload = req.body;
  //   // const payload = {
  //   //   ...req.body,
  //   //   user: req.user,
  //   // };

  //   // if (
  //   //   payload.film_synopsis &&
  //   //   payload.film_synopsis.split(/\s+/).length > 150
  //   // ) {
  //   //   return res.status(422).json({
  //   //     status: "error",
  //   //     message: "The film synopsis must not exceed 150 words.",
  //   //   });
  //   // }

  //   const { validatorSchema, messages } = await NfaFeature.validateData(
  //     payload
  //   );

  //   const { error } = validatorSchema.validate(payload, { abortEarly: false });
  //   if (error) {
  //     responseHelper(res, "validatorerrors", {
  //       message: error.details.reduce((acc, curr) => {
  //         acc[curr.context.key] = curr.message;
  //         return acc;
  //       }, {}),
  //     });
  //   }
  //   return;

  //   try {
  //     const user = req.user;
  //     const data = await NfaFeature.consumeRecords(payload, user);
  //     data.step = payload.step;

  //     if (data.step === 1) {
  //       const user = await Client.findOne({ where: { id: data.client_id } });
  //       if (user.usertype !== 1) {
  //         responseHelper(res, "notvalid", {
  //           message: "You are not a valid user to fill this form.!!",
  //         });
  //       }
  //     }

  //     const stepHandlers = {
  //       [CONSTANT.stepsFeature().GENRAL]: async (data, payload, user) =>
  //         await nfaFeatureController.handleGeneralStep(data, payload, user),

  //       [CONSTANT.stepsFeature().CENSOR]: async (data, payload, user) =>
  //         await handleCensorStep(data, payload, user),

  //       [CONSTANT.stepsFeature().COMPANY_REGISTRATION]: async (
  //         data,
  //         payload,
  //         user
  //       ) => await handleCompanyRegistrationStep(data, payload, user),

  //       [CONSTANT.stepsFeature().PRODUCER]: async (data, payload, user) =>
  //         await handleProducerStep(data, payload, user),

  //       [CONSTANT.stepsFeature().DIRECTOR]: async (data, payload, user) =>
  //         await handleDirectorStep(data, payload, user),

  //       [CONSTANT.stepsFeature().ACTORS]: async (data, payload, user) =>
  //         await handleActorsStep(data, payload, user),

  //       [CONSTANT.stepsFeature().SONGS]: async (data, payload, user) =>
  //         await handleSongsStep(data, payload, user),

  //       [CONSTANT.stepsFeature().AUDIOGRAPHER]: async (data, payload, user) =>
  //         await handleAudiographerStep(data, payload, user),

  //       [CONSTANT.stepsFeature().OTHER]: async (data, payload, user) =>
  //         await handleOtherStep(data, payload, user),

  //       [CONSTANT.stepsFeature().RETURN_ADDRESS]: async (data, payload, user) =>
  //         await handleReturnAddressStep(data, payload, user),

  //       [CONSTANT.stepsFeature().DECLARATION]: async (data, payload, user) =>
  //         await handleDeclarationStep(data, payload, user),
  //     };

  //     if (stepHandlers[data.step]) {
  //       // return await stepHandlers[data.step](payload, data, req.user.id);
  //       const result = await stepHandlers[data.step](
  //         payload,
  //         data,
  //         req.user.id
  //       );

  //       // if (result?.status === "created") {
  //       //   // responseHelper(res, `'${result?.status}'`, { result });
  //       //   return res.status(201).json(result.data);
  //       // }
  //       // if (result?.status === "exception") {
  //       //   return res.status(422).json(result.data);
  //       // }

  //       if (result?.status === "created") {
  //         return responseHelper(res, "created", {
  //           message: result?.data?.message || "Created successfully.",
  //           data: result?.data?.record || result.data,
  //         });
  //       }

  //       if (result?.status === "exception") {
  //         return responseHelper(res, "unprocessable", {
  //           message:
  //             result?.data?.message || "There was an issue with your request.",
  //           errors: result?.data?.errors || {},
  //         });
  //       }
  //       return res.status(200).json(result);
  //     }

  //     responseHelper(res, "badrequest", { message: "Invalid step provided" });
  //   } catch (error) {
  //     responseHelper(res, "exception", { message: error.message });
  //   }
  // },

  Entry: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = NfaFeatureHelper.validateStepInput(
      req.body,
      files
    );

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    // console.log(files);
    // console.log(req.body);
    // return "From Controller";

    try {
      // const payload = req.body;
      // const user = req.user;
      const payload = {
        ...req.body,
        user: req.user,
        files: req.files,
      };
      const data = await NfaFeature.consumeRecords(payload);
      data.step = payload.step;

      if (data.step === 1) {
        const user = await Client.findOne({ where: { id: data.client_id } });
        if (user.usertype !== 1) {
          responseHelper(res, "notvalid", {
            message: "You are not a valid user to fill this form.!!",
          });
        }
      }

      // console.log(data);
      // return "From Controller";

      const stepHandlers = {
        [CONSTANT.stepsFeature().GENRAL]: async (data, payload) =>
          await nfaFeatureController.handleGeneralStep(data, payload),

        [CONSTANT.stepsFeature().CENSOR]: async (data, payload) =>
          await nfaFeatureController.handleCensorStep(data, payload),

        [CONSTANT.stepsFeature().COMPANY_REGISTRATION]: async (data, payload) =>
          await handleCompanyRegistrationStep(data, payload),

        [CONSTANT.stepsFeature().PRODUCER]: async (data, payload) =>
          await handleProducerStep(data, payload),

        [CONSTANT.stepsFeature().DIRECTOR]: async (data, payload) =>
          await handleDirectorStep(data, payload),

        [CONSTANT.stepsFeature().ACTORS]: async (data, payload) =>
          await handleActorsStep(data, payload),

        [CONSTANT.stepsFeature().SONGS]: async (data, payload) =>
          await handleSongsStep(data, payload),

        [CONSTANT.stepsFeature().AUDIOGRAPHER]: async (data, payload) =>
          await handleAudiographerStep(data, payload),

        [CONSTANT.stepsFeature().OTHER]: async (data, payload) =>
          await handleOtherStep(data, payload),

        [CONSTANT.stepsFeature().RETURN_ADDRESS]: async (data, payload) =>
          await handleReturnAddressStep(data, payload),

        [CONSTANT.stepsFeature().DECLARATION]: async (data, payload) =>
          await handleDeclarationStep(data, payload),
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
        return res.status(200).json(result);
      }
      responseHelper(res, "badrequest", { message: "Invalid step provided" });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  handleGeneralStep: async (data, payload) => {
    const lastId = payload.last_id || null;

    if (lastId) {
      const checkForm = await NfaFeature.findOne({
        where: { client_id: data.client_id, id: lastId },
      });

      if (!checkForm) {
        return {
          status: "updateError",
          message: "Please provide valid details to update.!!",
        };
      }
      if (
        !checkForm.active_step ||
        checkForm.active_step < CONSTANT.stepsFeature().GENRAL
      ) {
        data.active_step = CONSTANT.stepsFeature().GENRAL;
      }
      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }

    payload.active_step = payload.step;
    create = await NfaFeature.createFeature(payload);
    return {
      status: "created",
      data: { message: "Feature form created.!!", record: create },
    };
  },

  handleCensorStep: async (data, payload, user) => {
    const lastId = payload.last_id;
    // console.log(payload);
    // return "From Controller : handleCensorStep";
    if (lastId) {
      const checkForm = await NfaFeature.findOne({
        where: { client_id: payload.user.id, id: lastId },
      });

      if (!checkForm) {
        return {
          status: "updateError",
          message: "Please provide valid details to update.!!",
        };
      }

      if (
        !checkForm.active_step ||
        checkForm.active_step < CONSTANT.stepsFeature().CENSOR
      ) {
        data.active_step = CONSTANT.stepsFeature().CENSOR;
      }

      if (payload.files && Array.isArray(payload.files)) {
        const censorFile = payload.files.find(
          (file) => file.fieldname === "censor_certificate_file"
        );
        if (censorFile) {
          const fileUpload = await ImageLib.imageUpload({
            id: lastId,
            image_key: "censor_certificate_file",
            websiteType: "NFA",
            formType: "FEATURE",
            image: censorFile,
          });

          if (!fileUpload.status) {
            return response("exception", { message: "Image not uploaded.!!" });
          }

          data.censor_certificate_file = censorFile.originalname ?? null;
        } else {
          data.censor_certificate_file = null;
        }
      } else {
        data.censor_certificate_file = null;
      }

      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }
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
