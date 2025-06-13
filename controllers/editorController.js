const { Editor } = require("../models/Editor");
const ProducerSchema = require("../helpers/producerSchema");
const responseHelper = require("../helpers/responseHelper");
const EditorSchema = require("../helpers/editorSchema");
const { NfaFeature } = require("../models/NfaFeature");
const { Producer } = require("../models/Producer");
const ImageLib = require("../libraries/ImageLib");
const { BestBookCinema } = require("../models/BestBookCinema");
const { BestFilmCritic } = require("../models/BestFilmCritic");
const { where } = require("sequelize");

const EditorController = {
  storeEditor: async (req, res) => {
    const { isValid, errors } = EditorSchema.validateStore(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      if (
        payload.best_book_cinema_id &&
        payload.best_book_cinema_id.trim() !== ""
      ) {
        bestBookCinema = await BestBookCinema.findOne({
          where: {
            id: payload.best_book_cinema_id,
            client_id: payload.user.id,
          },
        });

        if (!bestBookCinema) {
          return responseHelper(res, "noresult");
        }
      }

      if (
        payload.best_film_critic_id &&
        payload.best_film_critic_id.trim() !== ""
      ) {
        bestFilmCritic = await BestFilmCritic.findOne({
          where: {
            id: payload.best_film_critic_id,
            client_id: payload.user.id,
          },
        });
        if (!bestFilmCritic) {
          return responseHelper(res, "noresult");
        }
      }

      arrayToInsert = {
        client_id: payload.user.id,
        best_book_cinema_id: payload.best_book_cinema_id ?? null,
        best_film_critic_id: payload.best_film_critic_id ?? null,
        editor_name: payload.editor_name,
        editor_email: payload.editor_email,
        editor_mobile: payload.editor_mobile,
        editor_landline: payload.editor_landline ?? null,
        editor_fax: payload.editor_fax ?? null,
        editor_address: payload.editor_address,
        editor_citizenship: payload.editor_citizenship,
      };

      editor = await Editor.create(arrayToInsert);

      if (!editor) {
        return responseHelper(res, "noresult", {
          message: "Producer not created.!!",
        });
      }
      return responseHelper(res, "created", {
        message: "Producer created successfully.!!",
        data: editor,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateEditor: async (req, res) => {
    const { isValid, errors } = EditorSchema.validateUpdate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      const editor = await Editor.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });

      if (!editor) {
        return responseHelper(res, "noresult");
      }

      if (
        editor.best_book_cinema_id !== null &&
        payload.best_book_cinema_id !== String(editor.best_book_cinema_id)
      ) {
        return responseHelper(res, "updateError", {
          message: "You cannot modify Best book cinema ID.!!",
        });
      }

      if (
        editor.best_film_critic_id !== null &&
        payload.best_film_critic_id !== String(editor.best_film_critic_id)
      ) {
        return responseHelper(res, "updateError", {
          message: "You cannot modify Best film critic ID.!!",
        });
      }

      const updatedData = {
        best_book_cinema_id:
          payload.best_book_cinema_id ?? editor.best_book_cinema_id,
        best_film_critic_id:
          payload.best_film_critic_id ?? editor.best_film_critic_id,
        editor_name: payload.editor_name ?? editor.editor_name,
        editor_email: payload.editor_email ?? editor.editor_email,
        editor_mobile: payload.editor_mobile ?? editor.editor_mobile,
        editor_landline: payload.editor_landline ?? editor.editor_landline,
        editor_fax: payload.editor_fax ?? editor.editor_fax,
        editor_address: payload.editor_address ?? editor.editor_address,
        editor_citizenship:
          payload.editor_citizenship ?? editor.editor_citizenship,
      };

      const editorUpdate = await editor.update(updatedData);
      if (!editorUpdate) {
        responseHelper(res, "exception", { message: error.message });
      }
      responseHelper(res, "success", {
        message: "Updated successfully.!!",
        data: editorUpdate,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  listEditor: async (req, res) => {
    const { isValid, errors } = EditorSchema.validateList(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      let allEditor;
      let whereTo = {};

      if (payload.best_book_cinema_id != null) {
        const checkBestBook = await BestBookCinema.findOne({
          where: {
            id: payload.best_book_cinema_id,
            client_id: payload.user.id,
          },
        });

        if (!checkBestBook) {
          return responseHelper(res, "noresult", {
            message: "Please provide valid details.!!",
          });
        }

        whereTo = {
          best_book_cinema_id: payload.best_book_cinema_id,
          client_id: payload.user.id,
        };
      }

      if (payload.best_film_critic_id != null) {
        const checkBestFilmCritic = await BestFilmCritic.findOne({
          where: {
            id: payload.best_film_critic_id,
            client_id: payload.user.id,
          },
        });

        if (!checkBestFilmCritic) {
          return responseHelper(res, "noresult", {
            message: "Please provide valid details.!!",
          });
        }

        whereTo = {
          best_film_critic_id: payload.best_film_critic_id,
          client_id: payload.user.id,
        };
      }

      if (Object.keys(whereTo).length === 0) {
        return responseHelper(res, "noresult", {
          message: "No valid identifier provided.",
        });
      }

      allEditor = await Editor.findAll({
        where: whereTo,
      });

      if (!allEditor) {
        return responseHelper(res, "success", {
          message: "No result found.!!",
        });
      }
      return responseHelper(res, "success", { data: allEditor });
    } catch (error) {
      return responseHelper(res, "exception", { message: error });
    }
  },

  getEditor: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const editor = await Editor.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (editor) {
        responseHelper(res, "success", { data: editor });
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  deleteEditor: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const editor = await Editor.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (editor) {
        await editor.destroy();
        responseHelper(res, "success");
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = EditorController;
