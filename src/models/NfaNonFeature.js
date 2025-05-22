const LibrariesNFANonFeature = require("../libraries/NfaNonFeatureLibrary");
const CONSTANT = require("../libraries/Constant");
const { Document } = require("./Document");
const { DataTypes } = require("sequelize");
const sequelize = require(".");

const NfaNonFeature = sequelize.define(
  "NfaNonFeature",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    step: { type: DataTypes.INTEGER, allowNull: true },
    active_step: { type: DataTypes.TINYINT, allowNull: true },
    payment_status: { type: DataTypes.TINYINT, allowNull: true },
    status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: true },
    client_id: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    film_title_roman: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    film_title_devnagri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    film_title_english: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("language_id");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (e) {
          return [];
        }
      },
    },
    english_subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    director_debut: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nom_reels_tapes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aspect_ratio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    format: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sound_system: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    running_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color_bw: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    film_synopsis: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    censor_certificate_nom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    censor_certificate_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // censor_certificate_file: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    company_reg_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // company_reg_doc: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    title_registratin_detils: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    original_screenplay_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    original_screenplay_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adapted_screenplay_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    story_writer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    work_under_public_domain: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    // original_work_copy: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    dialogue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cinemetographer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    editor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    costume_designer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    animator: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stunt_choreographer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    music_director: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    special_effect_creator: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shot_digital_video_format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    production_designer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // make_up_director: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    choreographer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_fax: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    return_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    declaration_one: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_two: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_three: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_four: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_five: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_six: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_seven: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_eight: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_nine: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_ten: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_eleven: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    declaration_twelve: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },

    created_at: { type: DataTypes.TIME },
    updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "nfa_non_features",
    // hooks: {
    //   beforeCreate: (client) => {
    //     client.password = bcrypt.hashSync(client.password, 10);
    //   },
    // },
  }
);

NfaNonFeature.hasMany(Document, {
  foreignKey: "context_id",
  sourceKey: "id",
  as: "documents",
});

const consumeRecords = async (payload) => {
  const methodMap = {
    [CONSTANT.stepsNonFeature().GENRAL]: "consumeGENERAL",
    [CONSTANT.stepsNonFeature().CENSOR]: "consumeCENSOR",
    [CONSTANT.stepsNonFeature().COMPANY_REGISTRATION]:
      "consumeCOMPANYREGISTRATION",
    [CONSTANT.stepsNonFeature().PRODUCER]: "consumePRODUCER",
    [CONSTANT.stepsNonFeature().DIRECTOR]: "consumeDIRECTOR",
    [CONSTANT.stepsNonFeature().OTHER]: "consumeOTHER",
    [CONSTANT.stepsNonFeature().RETURN_ADDRESS]: "consumeRETURNADDRESS",
    [CONSTANT.stepsNonFeature().DECLARATION]: "consumeDECLARATION",
  };

  if (methodMap[payload.step]) {
    return LibrariesNFANonFeature[methodMap[payload.step]](payload);
  }
  return {};
};

NfaNonFeature.consumeRecords = consumeRecords;
module.exports = { NfaNonFeature };
