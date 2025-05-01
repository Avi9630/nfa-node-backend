const ProducerSchema = require("../helpers/producerSchema");
const responseHelper = require("../helpers/responseHelper");
const ImageLib = require("../libraries/ImageLib");
const { NfaFeature } = require("../models/NfaFeature");
const { NfaNonFeature } = require("../models/NfaNonFeature");
const { Producer } = require("../models/Producer");

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
          return responseHelper(res, "exception", {
            message: "NFA Feature are not found.!! ",
          });
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
          return responseHelper(res, "exception", {
            message: "NFA Non Feature are not found.!! ",
          });
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
        return responseHelper(res, "exception", {
          message: "Producer not created.!!",
        });
      }

      const formType = payload.nfa_feature_id
        ? "FEATURE"
        : payload.nfa_non_feature_id
        ? "NON_FEATURE"
        : null;

      if (formType == "") {
        return responseHelper(res, "exception", {
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
            return response(res, "exception", {
              message: "Producer Doc not uploaded.!!",
            });
          }
        }
      }
      responseHelper(res, "created", {
        message: "Producer created successfully.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = ProducerController;
