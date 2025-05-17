const responseHelper = require("../helpers/responseHelper");
const BestBookCinemaHelper = require("../helpers/bestBookCinemaHelper");
const { BestBookCinema } = require("../models/BestBookCinema");
const CONSTANT = require("../libraries/Constant");
const ImageLib = require("../libraries/ImageLib");
const { Client } = require("../models/Client");
const { Book } = require("../models/Book");
const { Editor } = require("../models/Editor");
const { Document } = require("../models/Document");

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

      const user = await Client.findOne({ where: { id: payload.user.id } });
      if (user.usertype !== 2) {
        responseHelper(res, "notvalid", {
          message: "You are not a valid user to fill this form.!!",
        });
      }

      const stepHandlers = {
        [CONSTANT.stepsBestBook().BEST_BOOK_ON_CINEMA]: async (data, payload) =>
          await BestBookCinemaController.handleBestBookOnCinemaStep(
            data,
            payload
          ),

        [CONSTANT.stepsBestBook().AUTHOR]: async (data, payload) =>
          await BestBookCinemaController.handleAuthorStep(data, payload),

        [CONSTANT.stepsBestBook().PUBLISHER_EDITOR]: async (data, payload) =>
          await BestBookCinemaController.handlePublisherEditorStep(
            data,
            payload
          ),

        [CONSTANT.stepsBestBook().DECLARATION]: async (data, payload) =>
          await BestBookCinemaController.handleDeclarationStep(data, payload),
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

  finalSubmit: async (req, res) => {
    const { isValid, errors } = BestBookCinemaHelper.finalSubmitStep(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const bestBookCinema = await BestBookCinema.findOne({
        where: {
          id: payload.last_id,
          client_id: payload.user.id,
        },
      });

      if (!bestBookCinema) {
        return responseHelper(res, "exception", {
          message: "You do not have any entries.!!",
        });
      }

      if (bestBookCinema.payment_status !== 2) {
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

  handleBestBookOnCinemaStep: async (data, payload) => {
    const lastId = payload.last_id || null;

    if (lastId) {
      const checkForm = await BestBookCinema.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestBook().BEST_BOOK_ON_CINEMA
      ) {
        data.active_step = CONSTANT.stepsBestBook().BEST_BOOK_ON_CINEMA;
      }
      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }

    data.active_step = payload.step;
    create = await BestBookCinema.createBestBook(data);
    return {
      status: "created",
      data: { message: "Beast book created.!!", record: create },
    };
  },

  handleAuthorStep: async (data, payload) => {
    const lastId = payload.last_id;

    if (lastId) {
      const checkForm = await BestBookCinema.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestBook().AUTHOR
      ) {
        data.active_step = CONSTANT.stepsBestBook().AUTHOR;
      }

      if (payload.files && Array.isArray(payload.files)) {
        const authorAadhaar = payload.files.find(
          (file) => file.fieldname === "author_aadhaar_card"
        );

        if (authorAadhaar) {
          const fileUpload = await ImageLib.imageUpload({
            id: lastId,
            image_key: "author_aadhaar_card",
            websiteType: "NFA",
            formType: "BEST_BOOK",
            image: authorAadhaar,
          });

          if (!fileUpload.status) {
            return response("exception", { message: "Image not uploaded.!!" });
          }

          data.author_aadhaar_card = authorAadhaar.originalname ?? null;
        } else {
          data.author_aadhaar_card = null;
        }
      } else {
        data.author_aadhaar_card = null;
      }
      update = await checkForm.update(data);
      return {
        status: "success",
        message: "Records updated successfully.!!",
        data: update,
      };
    }
  },

  handlePublisherEditorStep: async (data, payload) => {
    const lastId = payload.last_id;
    if (lastId) {
      const checkForm = await BestBookCinema.findOne({
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
        checkForm.active_step < CONSTANT.stepsBestBook().PUBLISHER_EDITOR
      ) {
        data.active_step = CONSTANT.stepsBestBook().PUBLISHER_EDITOR;
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

    const checkForm = await BestBookCinema.findOne({
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
      checkForm.active_step < CONSTANT.stepsBestBook().DECLARATION
    ) {
      data.active_step = CONSTANT.stepsBestBook().DECLARATION;
    }

    update = await checkForm.update(data);
    return {
      status: "success",
      message: "Records updated successfully.!!",
      data: update,
    };
  },
  bestBookById: async (req, res) => {
    const payload = {
      ...req.params,
      user: req.user,
    };

    try {
      const bestBookCinema = await BestBookCinema.findOne({
        where: {
          id: payload.id,
          client_id: payload.user.id,
        },
        include: [
          {
            model: Document,
            as: "documents",
            where: {
              form_type: 3,
              website_type: 5,
              document_type: 7,
              // document_type: {
              //   [Op.in]: [1, 2, 3],
              // },
            },
            required: false,
          },
        ],
      });

      if (!bestBookCinema) {
        return res.status(404).json({
          status: "exception",
          message: "Something went wrong!!",
        });
      }

      const [books, editors] = await Promise.all([
        Book.findAll({ where: { best_book_cinemas_id: bestBookCinema.id } }),
        Editor.findAll({ where: { best_book_cinema_id: bestBookCinema.id } }),
      ]);

      const data = {
        ...bestBookCinema.toJSON(),
        books,
        editors,
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
module.exports = BestBookCinemaController;
