const { DataTypes } = require("sequelize");
const sequelize = require(".");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    context_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isNumeric: true, notEmpty: true },
    },
    form_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { isNumeric: true, notEmpty: true },
    },
    document_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
      validate: { isNumeric: true, notEmpty: true },
    },
    website_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: { notEmpty: true },
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: false },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: false },
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
  },
  {
    timestamps: false,
    tableName: "documents",
  }
);

Document.associate = (models) => {
  Document.belongsTo(models.NfaFeature, {
    foreignKey: "nfa_feature_id",
    as: "nfaFeature",
  });
};

const documentType = () => {
  return {
    CENSOR_CERTIFICATE_FILE: 1, //censor_certificate_file
    COMPANY_REG_DOC: 2, //company_reg_doc
    ORIGINAL_WORK_COPY: 3, //original_work_copy
    PRODUCER_SELF_ATTESTED_DOC: 4, //producer_self_attested_doc
    DIRECTOR_SELF_ATTESTED_DOC: 5, //director_self_attested_doc
    CRITIC_AADHAAR_CARD: 6, //critic_aadhaar_card
    AUTHOR_AADHAAR_CARD: 7, //author_aadhaar_card
  };
};

const storeImage = async (args, fileDetails) => {
  try {
    const document = await Document.findOne({ where: args });

    if (document) {
      await document.update(fileDetails);
      return {
        status: true,
        message: "File updated successfully!!",
      };
    } else {
      await Document.create(fileDetails);
      return {
        status: true,
        message: "File created successfully!!",
      };
    }
  } catch (error) {
    console.error("Upload Document Error:", error.message);
    return {
      status: false,
      message: "Error occurred during file upload.",
    };
  }
};

Document.documentType = documentType;
Document.storeImage = storeImage;
module.exports = { Document };
