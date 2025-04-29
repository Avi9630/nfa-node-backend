const responseHelper = require("../helpers/responseHelper");
const { NfaFeature } = require("../models/NfaFeature");
const { Client } = require("../models/Client");
const ImageLib = require("../libraries/ImageLib");
const CONSTANT = require("../libraries/Constant");
const NfaNonFeatureHelper = require("../helpers/nfaNonFeatureHelper");
const { NfaNonFeature } = require("../models/NfaNonFeature");
// const Mail = require("../mailer/Mail");

const nfaNonFeatureController = {
  Entry: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = NfaNonFeatureHelper.validateStepInput(
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

      const data = await NfaNonFeature.consumeRecords(payload);
      data.step = payload.step;

      // console.log(data);
      // return "From Controller";

      const user = await Client.findOne({ where: { id: payload.user.id } });
      if (user.usertype !== 2) {
        responseHelper(res, "notvalid", {
          message: "You are not a valid user to fill this form.!!",
        });
      }

      const stepHandlers = {
        [CONSTANT.stepsNonFeature().GENRAL]: async (data, payload) =>
          await nfaNonFeatureController.handleGeneralStep(data, payload),

        [CONSTANT.stepsNonFeature().CENSOR]: async (data, payload) =>
          await nfaNonFeatureController.handleCensorStep(data, payload),

        [CONSTANT.stepsNonFeature().COMPANY_REGISTRATION]: async (
          data,
          payload
        ) =>
          await nfaNonFeatureController.handleCompanyRegistrationStep(
            data,
            payload
          ),

        [CONSTANT.stepsNonFeature().PRODUCER]: async (data, payload) =>
          await nfaNonFeatureController.handleProducerStep(data, payload),

        [CONSTANT.stepsNonFeature().DIRECTOR]: async (data, payload) =>
          await nfaNonFeatureController.handleDirectorStep(data, payload),

        [CONSTANT.stepsNonFeature().OTHER]: async (data, payload) =>
          await nfaNonFeatureController.handleOtherStep(data, payload),

        [CONSTANT.stepsNonFeature().RETURN_ADDRESS]: async (data, payload) =>
          await nfaNonFeatureController.handleReturnAddressStep(data, payload),

        [CONSTANT.stepsNonFeature().DECLARATION]: async (data, payload) =>
          await nfaNonFeatureController.handleDeclarationStep(data, payload),
      };

      if (stepHandlers[data.step]) {
        const result = await stepHandlers[data.step](data, payload);
        console.log(result);
        return "Result";

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
    create = await NfaNonFeature.createNonFeature(data);
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
    const { isValid, errors } = NfaNonFeatureHelper.finalSubmitStep(req.body);
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
};

module.exports = nfaNonFeatureController;
