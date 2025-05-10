const BestFilmCriticHelper = require("../helpers/bestFilmCriticHelper");
const { BestBookCinema } = require("../models/BestBookCinema");
const responseHelper = require("../helpers/responseHelper");
const CONSTANT = require("../libraries/Constant");
const ImageLib = require("../libraries/ImageLib");
const { Client } = require("../models/Client");
const { BestFilmCritic } = require("../models/BestFilmCritic");

const BestFilmCriticController = {
  Entry: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = BestFilmCriticHelper.validateStepInput(
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

      const data = await BestFilmCritic.consumeRecords(payload);
      data.step = payload.step;

      // console.log(req.body);
      // return "From Controller";

      const user = await Client.findOne({ where: { id: payload.user.id } });
      if (user.usertype !== 2) {
        responseHelper(res, "notvalid", {
          message: "You are not a valid user to fill this form.!!",
        });
      }

      const stepHandlers = {
        [CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC]: async (
          data,
          payload
        ) =>
          await BestFilmCriticController.handleBestFilmCriticStep(
            data,
            payload
          ),

        [CONSTANT.stepsBestFilmCritic().CRITIC]: async (data, payload) =>
          await BestFilmCriticController.handleCriticStep(data, payload),

        [CONSTANT.stepsBestFilmCritic().PUBLISHER]: async (data, payload) =>
          await BestFilmCriticController.handlePublisherStep(data, payload),

        [CONSTANT.stepsBestFilmCritic().DECLARATION]: async (data, payload) =>
          await BestFilmCriticController.handleDeclarationStep(data, payload),
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
        return responseHelper(res, "success", {
          message: result.message,
          data: result.data,
        });
      }

      responseHelper(res, "badrequest", {
        message: "Invalid step provided.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  finalSubmit: async (req, res) => {
    const { isValid, errors } = BestFilmCriticHelper.finalSubmitStep(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const bestFilmCritic = await BestFilmCritic.findOne({
        where: {
          id: payload.last_id,
          client_id: payload.user.id,
        },
      });

      if (!bestFilmCritic) {
        return responseHelper(res, "exception", {
          message: "You do not have any entries.!!",
        });
      }

      if (bestFilmCritic.payment_status !== 2) {
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

  handleBestFilmCriticStep: async (data, payload) => {
    const lastId = payload.last_id || null;

    if (lastId) {
      const checkForm = await BestFilmCritic.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC
      ) {
        data.active_step = CONSTANT.stepsBestFilmCritic().BEST_FILM_CRITIC;
      }

      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }

    data.active_step = payload.step;
    create = await BestFilmCritic.createFilmCritic(data);

    return {
      status: "created",
      data: { message: "Beast book created.!!", record: create },
    };
  },

  handleCriticStep: async (data, payload) => {
    const lastId = payload.last_id;

    if (lastId) {
      const checkForm = await BestFilmCritic.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestFilmCritic().CRITIC
      ) {
        data.active_step = CONSTANT.stepsBestFilmCritic().CRITIC;
      }

      if (payload.files && Array.isArray(payload.files)) {
        const criticAadhaar = payload.files.find(
          (file) => file.fieldname === "critic_aadhaar_card"
        );

        if (criticAadhaar) {
          const fileUpload = await ImageLib.imageUpload({
            id: lastId,
            image_key: "critic_aadhaar_card",
            websiteType: "NFA",
            formType: "BEST_FILM_CRITIC",
            image: criticAadhaar,
          });

          if (!fileUpload.status) {
            return response("exception", { message: "Image not uploaded.!!" });
          }

          data.critic_aadhaar_card = criticAadhaar.originalname ?? null;
        } else {
          data.critic_aadhaar_card = null;
        }
      } else {
        data.critic_aadhaar_card = null;
      }

      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }
  },

  handlePublisherStep: async (data, payload) => {
    const lastId = payload.last_id;

    if (lastId) {
      const checkForm = await BestFilmCritic.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestFilmCritic().PUBLISHER
      ) {
        data.active_step = CONSTANT.stepsBestFilmCritic().PUBLISHER;
      }
      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }
  },

  handleDeclarationStep: async (data, payload) => {
    const lastId = payload.last_id;

    const checkForm = await BestFilmCritic.findOne({
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
      checkForm.active_step < CONSTANT.stepsBestFilmCritic().DECLARATION
    ) {
      data.active_step = CONSTANT.stepsBestFilmCritic().DECLARATION;
    }

    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },
};
module.exports = BestFilmCriticController;
