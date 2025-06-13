const { NfaNonFeature } = require("../models/NfaNonFeature");
const ProducerSchema = require("../helpers/producerSchema");
const responseHelper = require("../helpers/responseHelper");
const DirectorSchema = require("../helpers/directorSchema");
const { NfaFeature } = require("../models/NfaFeature");
const { Director } = require("../models/Director");
const ImageLib = require("../libraries/ImageLib");
const { Document } = require("../models/Document");

const DirectorController = {
  storeDirector: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = DirectorSchema.validateStore(req.body, files);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
        files: req.files,
      };

      if (payload.nfa_feature_id && payload.nfa_feature_id.trim() !== "") {
        nfaFeature = await NfaFeature.findOne({
          where: { id: payload.nfa_feature_id, client_id: payload.user.id },
        });
        if (!nfaFeature) {
          return responseHelper(res, "noresult");
        }
      }

      if (
        payload.nfa_non_feature_id &&
        payload.nfa_non_feature_id.trim() !== ""
      ) {
        nfaNonFeature = await NfaNonFeature.findOne({
          where: { id: payload.nfa_non_feature_id, client_id: payload.user.id },
        });
        if (!nfaNonFeature) {
          return responseHelper(res, "noresult");
        }
      }

      // const directorFile = payload.files.find(
      //   (file) => file.fieldname === "director_self_attested_doc"
      // );

      arrayToInsert = {
        client_id: payload.user.id,
        nfa_feature_id: payload.nfa_feature_id ?? null,
        nfa_non_feature_id: payload.nfa_non_feature_id ?? null,
        indian_national: payload.indian_national,
        name: payload.name,
        receive_director_award: payload.receive_director_award ?? null,
        contact_nom: payload.contact_nom,
        email: payload.email,
        address: payload.address,
        pincode: payload.pincode,
        // director_self_attested_doc: directorFile.originalname,
        country_of_nationality: payload.country_of_nationality ?? null,
        // production_company: payload.production_company ?? null,
      };

      director = await Director.create(arrayToInsert);

      if (!director) {
        return responseHelper(res, "noresult", {
          message: "Director not created.!!",
        });
      }

      const formType = payload.nfa_feature_id
        ? "FEATURE"
        : payload.nfa_non_feature_id
        ? "NON_FEATURE"
        : null;

      if (formType == "") {
        return responseHelper(res, "noresult", {
          message: "Invalid formtype.!! ",
        });
      }

      if (payload.files && Array.isArray(payload.files)) {
        const directorDoc = payload.files.find(
          (file) => file.fieldname === "director_self_attested_doc"
        );

        if (directorDoc) {
          const fileUpload = await ImageLib.imageUpload({
            id: director.id,
            image_key: "director_self_attested_doc",
            websiteType: "NFA",
            formType: formType,
            image: directorDoc,
          });

          if (!fileUpload.status) {
            return responseHelper(res, "exception", {
              message: "Director Doc not uploaded.!!",
            });
          }
        }
      }
      return responseHelper(res, "created", {
        message: "Director created successfully.!!",
        data: director,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateDirector: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = DirectorSchema.validateUpdate(req.body, files);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
        files: req.files,
      };

      const director = await Director.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });

      if (!director) {
        return responseHelper(res, "noresult");
      }

      if (
        director.nfa_feature_id !== null &&
        payload.nfa_feature_id !== String(director.nfa_feature_id)
      ) {
        return responseHelper(res, "updateError", {
          message: "You cannot modify feature ID!",
        });
      }

      if (
        director.nfa_non_feature_id !== null &&
        payload.nfa_non_feature_id !== String(director.nfa_non_feature_id)
      ) {
        return responseHelper(res, "updateError", {
          message: "You cannot modify feature ID!",
        });
      }

      const formType = payload.nfa_feature_id
        ? "FEATURE"
        : payload.nfa_non_feature_id
        ? "NON_FEATURE"
        : "";

      const updatedData = {
        nfa_feature_id: payload.nfa_feature_id ?? director.nfa_feature_id,
        nfa_non_feature_id:
          payload.nfa_non_feature_id ?? director.nfa_non_feature_id,
        indian_national: payload.indian_national ?? director.indian_national,
        name: payload.name ?? director.name,
        receive_director_award:
          payload.receive_director_award ?? director.receive_director_award,
        contact_nom: payload.contact_nom ?? director.contact_nom,
        email: payload.email ?? director.email,
        address: payload.address ?? director.address,
        pincode: payload.pincode ?? director.pincode,
        country_of_nationality:
          payload.country_of_nationality ?? director.country_of_nationality,
        // director_self_attested_doc:
        //   payload.director_self_attested_doc ??
        //   director.director_self_attested_doc,
        // production_company:
        //   payload.production_company ?? director.production_company,
      };

      if (Array.isArray(payload.files)) {
        const directorFile = payload.files.find(
          (file) => file.fieldname === "director_self_attested_doc"
        );

        if (directorFile) {
          const fileUpload = await ImageLib.imageUpload({
            id: payload.id,
            image_key: "director_self_attested_doc",
            websiteType: "NFA",
            formType,
            image: directorFile,
          });

          if (!fileUpload.status) {
            return responseHelper(res, "exception", {
              message: "Image not uploaded!",
            });
          }

          updatedData.director_self_attested_doc = directorFile.originalname;
          await director.update(updatedData);
          return responseHelper(res, "success", { data: director });
        } else {
          await director.update(updatedData);
          return responseHelper(res, "success", { data: director });
        }
      }
      responseHelper(res, "exception", { message: error.message });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  listDirector: async (req, res) => {
    const { isValid, errors } = DirectorSchema.validateListDirector(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      let allDirector;

      if (payload.nfa_feature_id != null) {
        const checkFeature = await NfaFeature.findOne({
          where: { id: payload.nfa_feature_id, client_id: payload.user.id },
        });

        if (!checkFeature) {
          responseHelper(res, "noresult", {
            message: "Please provide valid details.!!",
          });
        }

        allDirector = await Director.findAll({
          where: {
            nfa_feature_id: payload.nfa_feature_id,
            client_id: payload.user.id,
          },
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
        });
      }

      if (payload.nfa_non_feature_id != null) {
        const checkNonFeature = await NfaNonFeature.findOne({
          where: { id: payload.nfa_non_feature_id, client_id: payload.user.id },
        });
        if (!checkNonFeature) {
          responseHelper(res, "noresult", {
            message: "Please provide valid details.!!",
          });
        }
        allDirector = await Director.findAll({
          where: {
            nfa_non_feature_id: payload.nfa_non_feature_id,
            client_id: payload.user.id,
          },
          include: [
            {
              model: Document,
              as: "documents",
              where: {
                form_type: 2,
                website_type: 5,
                document_type: 5,
              },
              required: false,
            },
          ],
        });
      }
      responseHelper(res, "success", { data: allDirector });
    } catch (error) {
      responseHelper(res, "exception", { message: error });
    }
  },

  getDirector: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const director = await Director.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (director) {
        responseHelper(res, "success", { data: director });
      } else {
        responseHelper(res, "noresult", { data: director });
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  deleteDirector: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const director = await Director.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (director) {
        await director.destroy();
        responseHelper(res, "success");
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = DirectorController;
