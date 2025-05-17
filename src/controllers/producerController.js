const { NfaNonFeature } = require("../models/NfaNonFeature");
const ProducerSchema = require("../helpers/producerSchema");
const responseHelper = require("../helpers/responseHelper");
const { NfaFeature } = require("../models/NfaFeature");
const { Producer } = require("../models/Producer");
const ImageLib = require("../libraries/ImageLib");
const { Document } = require("../models/Document");

const ProducerController = {
  storeProducer: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = ProducerSchema.validateStore(req.body, files);

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

      const censorFile = payload.files.find(
        (file) => file.fieldname === "producer_self_attested_doc"
      );

      arrayToInsert = {
        client_id: payload.user.id,
        nfa_feature_id: payload.nfa_feature_id ?? null,
        nfa_non_feature_id: payload.nfa_non_feature_id ?? null,
        indian_national: payload.indian_national,
        name: payload.name,
        receive_producer_award: payload.receive_producer_award ?? null,
        contact_nom: payload.contact_nom,
        email: payload.email,
        address: payload.address,
        pincode: payload.pincode,
        producer_self_attested_doc: censorFile.originalname,
        country_of_nationality: payload.country_of_nationality ?? null,
        production_company: payload.production_company ?? null,
      };

      producer = await Producer.create(arrayToInsert);

      if (!producer) {
        return responseHelper(res, "noresult", {
          message: "Producer not created.!!",
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
        const producerDoc = payload.files.find(
          (file) => file.fieldname === "producer_self_attested_doc"
        );

        if (producerDoc) {
          const fileUpload = await ImageLib.imageUpload({
            id: producer.id,
            image_key: "producer_self_attested_doc",
            websiteType: "NFA",
            formType: formType,
            image: producerDoc,
          });

          if (!fileUpload.status) {
            return responseHelper(res, "exception", {
              message: "Producer Doc not uploaded.!!",
            });
          }
        }
      }
      return responseHelper(res, "created", {
        message: "Producer created successfully.!!",
        data: producer,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  updateProducer: async (req, res) => {
    const files = req.files;
    const { isValid, errors } = ProducerSchema.validateUpdate(req.body, files);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
        files: req.files,
      };

      const producer = await Producer.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });

      if (!producer) {
        return responseHelper(res, "noresults");
      }

      if (
        producer.nfa_feature_id !== null &&
        payload.nfa_feature_id !== String(producer.nfa_feature_id)
      ) {
        return responseHelper(res, "updateError", {
          message: "You cannot modify feature ID!",
        });
      }

      if (
        producer.nfa_non_feature_id !== null &&
        payload.nfa_non_feature_id !== String(producer.nfa_non_feature_id)
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
        nfa_feature_id: payload.nfa_feature_id ?? producer.nfa_feature_id,
        nfa_non_feature_id:
          payload.nfa_non_feature_id ?? producer.nfa_non_feature_id,
        name: payload.name ?? producer.name,
        receive_producer_award:
          payload.receive_producer_award ?? producer.receive_producer_award,
        contact_nom: payload.contact_nom ?? producer.contact_nom,
        email: payload.email ?? producer.email,
        address: payload.address ?? producer.address,
        pincode: payload.pincode ?? producer.pincode,
        indian_national: payload.indian_national ?? producer.indian_national,
        producer_self_attested_doc:
          payload.producer_self_attested_doc ??
          producer.producer_self_attested_doc,
        production_company:
          payload.production_company ?? producer.production_company,
      };

      // country_of_nationality: payload.country_of_nationality ??
      //   producer.country_of_nationality,

      if (req.body.indian_national === "0") {
        updatedData.country_of_nationality = req.body.country_of_nationality;
      } else {
        updatedData.country_of_nationality = producer.country_of_nationality;
      }

      if (req.body.indian_national === "1") {
        updatedData.country_of_nationality = null;
      }

      if (Array.isArray(payload.files)) {
        const producerFile = payload.files.find(
          (file) => file.fieldname === "producer_self_attested_doc"
        );

        if (producerFile) {
          const fileUpload = await ImageLib.imageUpload({
            id: payload.id,
            image_key: "producer_self_attested_doc",
            websiteType: "NFA",
            formType,
            image: producerFile,
          });

          if (!fileUpload.status) {
            return responseHelper(res, "exception", {
              message: "Image not uploaded!",
            });
          }

          updatedData.producer_self_attested_doc = producerFile.originalname;
          await producer.update(updatedData);
          return responseHelper(res, "success", { data: producer });
        } else {
          await producer.update(updatedData);
          return responseHelper(res, "success", { data: producer });
        }
      }

      responseHelper(res, "exception", { message: error.message });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  listProducer: async (req, res) => {
    const { isValid, errors } = ProducerSchema.validateListProducer(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const payload = {
        ...req.body,
        user: req.user,
      };

      let allProducer;

      if (payload.nfa_feature_id != null) {
        const checkFeature = await NfaFeature.findOne({
          where: { id: payload.nfa_feature_id, client_id: payload.user.id },
        });
        if (!checkFeature) {
          responseHelper(res, "noresult", {
            message: "Please provide valid details.!!",
          });
        }
        allProducer = await Producer.findAll({
          where: {
            nfa_feature_id: payload.nfa_feature_id,
            client_id: payload.user.id,
          },
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
        allProducer = await Producer.findAll({
          where: {
            nfa_non_feature_id: payload.nfa_non_feature_id,
            client_id: payload.user.id,
          },
        });
      }
      responseHelper(res, "success", { data: allProducer });
    } catch (error) {
      responseHelper(res, "exception", { message: error });
    }
  },

  getProducer: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };

      const producer = await Producer.findOne({
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
              document_type: 4,
            },
            required: false,
          },
        ],
      });

      if (producer) {
        responseHelper(res, "success", { data: producer });
      } else {
        responseHelper(res, "noresult", { data: producer });
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  deleteProducer: async (req, res) => {
    try {
      const payload = {
        ...req.params,
        user: req.user,
      };
      const producer = await Producer.findOne({
        where: { id: payload.id, client_id: payload.user.id },
      });
      if (producer) {
        await producer.destroy();
        responseHelper(res, "success");
      } else {
        responseHelper(res, "noresult");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = ProducerController;
