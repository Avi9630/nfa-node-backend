const { DataTypes } = require("sequelize");
const sequelize = require(".");

const Producer = sequelize.define(
  "Producer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    nfa_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    nfa_non_feature_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true, notEmpty: true },
    },

    contact_nom: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },

    pincode: {
      type: DataTypes.STRING(),
      allowNull: false,
      // validate: { isNumeric: true, len: [6, 6] },
    },

    indian_national: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    producer_self_attested_doc: {
      type: DataTypes.STRING(),
      allowNull: false,
    },

    country_of_nationality: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    receive_producer_award: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    production_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // created_at: { type: DataTypes.TIME },
    // updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "producers",
  }
);

const generateUsername = async (usertype) => {
  const prefixes = { 1: "PRO000", 2: "PUB000", default: "OTR000" };
  const prefix = prefixes[usertype] || prefixes.default;

  const latestUser = await Client.findOne({
    where: { usertype },
    order: [["id", "DESC"]],
    attributes: ["username"],
  });

  const numPart = latestUser?.username
    ? parseInt(latestUser.username.replace(prefix, "")) || 0
    : 0;
  return `${prefix}${numPart + 1}`;
};

const findByCredential = async (clientEmail, clientPassword) => {
  const email = clientEmail.trim().toLowerCase();
  const client = await Client.findOne({ where: { email } });

  if (!client) {
    throw new Error("No account found with this email address.!!");
  }

  if (!client.active) {
    throw new Error(
      "Account not activated. Please check your email for activation link.!!"
    );
  }

  const isMatch = await bcrypt.compare(clientPassword, client.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }
  return client;
};

const generateAuthToken = async (client) => {
  const token = jwt.sign({ id: client.id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = { Producer };
