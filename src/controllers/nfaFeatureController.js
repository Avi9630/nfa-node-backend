// const { Producer, Director, Song, Actor, Audiographer } = require("../models");
const NfaFeatureHelper = require("../helpers/nfaFeatureHelper");
const responseHelper = require("../helpers/responseHelper");
const { NfaFeature } = require("../models/NfaFeature");
const { Audiographer } = require("../models/Audiographer");
const { Document } = require("../models/Document");
const { Producer } = require("../models/Producer");
const { Director } = require("../models/Director");
const { Actor } = require("../models/Actor");
const { Song } = require("../models/Song");
const ImageLib = require("../libraries/ImageLib");
const CONSTANT = require("../libraries/Constant");
const { Client } = require("../models/Client");
const { Op } = require("sequelize");

// const Mail = require("../mailer/Mail");

const nfaFeatureController = {
  Entry: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = NfaFeatureHelper.validateStepInput(
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

      const data = await NfaFeature.consumeRecords(payload);
      data.step = payload.step;

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

        if (result?.status === "success") {
          return responseHelper(res, "success", {
            message: result?.message,
            data: result?.data || {},
          });
        }
      } else {
        responseHelper(res, "badrequest", {
          message: "Invalid step provided.!!",
        });
      }
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

    data.active_step = payload.step;
    create = await NfaFeature.createFeature(data);
    return {
      status: "created",
      data: { message: "Feature form created.!!", record: create },
    };
  },

  handleCensorStep: async (data, payload) => {
    const lastId = payload.last_id;
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

  handleCompanyRegistrationStep: async (data, payload) => {
    const lastId = payload.last_id;
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
        checkForm.active_step < CONSTANT.stepsFeature().COMPANY_REGISTRATION
      ) {
        data.active_step = CONSTANT.stepsFeature().COMPANY_REGISTRATION;
      }
      if (payload.files && Array.isArray(payload.files)) {
        const censorFile = payload.files.find(
          (file) => file.fieldname === "company_reg_doc"
        );
        if (censorFile) {
          const fileUpload = await ImageLib.imageUpload({
            id: lastId,
            image_key: "company_reg_doc",
            websiteType: "NFA",
            formType: "FEATURE",
            image: censorFile,
          });

          if (!fileUpload.status) {
            return response("exception", { message: "Image not uploaded.!!" });
          }
          data.company_reg_doc = censorFile.originalname ?? null;
        } else {
          data.company_reg_doc = null;
        }
      } else {
        data.company_reg_doc = null;
      }

      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }
  },

  handleProducerStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().PRODUCER
    ) {
      data.active_step = CONSTANT.stepsFeature().PRODUCER;
    }
    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleDirectorStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().PRODUCER
    ) {
      data.active_step = CONSTANT.stepsFeature().PRODUCER;
    }
    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleActorsStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().PRODUCER
    ) {
      data.active_step = CONSTANT.stepsFeature().PRODUCER;
    }
    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleSongsStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().PRODUCER
    ) {
      data.active_step = CONSTANT.stepsFeature().PRODUCER;
    }
    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleAudiographerStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().PRODUCER
    ) {
      data.active_step = CONSTANT.stepsFeature().PRODUCER;
    }
    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleOtherStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().OTHER
    ) {
      data.active_step = CONSTANT.stepsFeature().OTHER;
    }

    if (payload.files && Array.isArray(payload.files)) {
      const otherFile = payload.files.find(
        (file) => file.fieldname === "original_work_copy"
      );

      if (otherFile) {
        const fileUpload = await ImageLib.imageUpload({
          id: lastId,
          image_key: "original_work_copy",
          websiteType: "NFA",
          formType: "FEATURE",
          image: otherFile,
        });

        if (!fileUpload.status) {
          return response("exception", { message: "Image not uploaded.!!" });
        }

        data.original_work_copy = otherFile.originalname ?? null;
      } else {
        data.original_work_copy = null;
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
  },

  handleReturnAddressStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().RETURN_ADDRESS
    ) {
      data.active_step = CONSTANT.stepsFeature().RETURN_ADDRESS;
    }

    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  handleDeclarationStep: async (data, payload, user) => {
    const lastId = payload.last_id;

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
      checkForm.active_step < CONSTANT.stepsFeature().DECLARATION
    ) {
      data.active_step = CONSTANT.stepsFeature().DECLARATION;
    }

    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },

  finalSubmit: async (req, res) => {
    const { isValid, errors } = NfaFeatureHelper.finalSubmitStep(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const nfaFeature = await NfaFeature.findOne({
        where: {
          id: payload.last_id,
          client_id: payload.user.id,
        },
      });

      if (!nfaFeature) {
        return responseHelper(res, "exception", {
          message: "You do not have any entries.!!",
        });
      }

      if (nfaFeature.payment_status !== 2) {
        return responseHelper(res, "exception", {
          message: "Your payment is not completed.!!",
        });
      }

      // const mailContent = {
      //   To: payload.user.email,
      //   Subject: "Payment successfully accepted | Indian Panorama | 55th IFFI",
      //   Data: {
      //     clientName: payload.user.first_name + " " + payload.user.last_name,
      //   },
      // };
      // await Mail.sendOtp(mailContent);

      return responseHelper(res, "success", {
        message: "You have successfully submitted your form.!!",
        data: nfaFeature,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  featureById: async (req, res) => {
    const payload = {
      ...req.params,
      user: req.user,
    };

    try {
      const nfaFeature = await NfaFeature.findOne({
        where: {
          id: payload.id,
          client_id: payload.user.id,
        },
        include: [
          {
            model: Document,
            as: "documents",
            where: {
              form_type: 1,
              website_type: 5,
              document_type: {
                [Op.in]: [1, 2, 3],
              },
            },
            required: false,
          },
        ],
      });

      if (!nfaFeature) {
        return res.status(404).json({
          status: "exception",
          message: "Something went wrong!!",
        });
      }

      const [producers, directors, songs, actors, audiographer] =
        await Promise.all([
          Producer.findAll({
            where: { nfa_feature_id: nfaFeature.id },
            include: [
              {
                model: Document,
                as: "documents",
                where: {
                  form_type: 1,
                  website_type: 5,
                  document_type: 4,
                },
                required: false,
              },
            ],
          }),
          Director.findAll({
            where: { nfa_feature_id: nfaFeature.id },
            include: [
              {
                model: Document,
                as: "documents",
                where: {
                  form_type: 1,
                  website_type: 5,
                  document_type: 5,
                },
                required: false,
              },
            ],
          }),
          Song.findAll({ where: { nfa_feature_id: nfaFeature.id } }),
          Actor.findAll({ where: { nfa_feature_id: nfaFeature.id } }),
          Audiographer.findAll({ where: { nfa_feature_id: nfaFeature.id } }),
        ]);

      const data = {
        ...nfaFeature.toJSON(),
        producers,
        directors,
        songs,
        actors,
        audiographer,
      };
      return res.status(200).json({
        status: "success",
        message: "Success.!!",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "exception",
        message: error.message,
      });
    }
  },
};

module.exports = nfaFeatureController;
