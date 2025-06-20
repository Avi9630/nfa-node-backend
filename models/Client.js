const { DataTypes } = require("sequelize");
const sequelize = require(".");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_id: { type: DataTypes.INTEGER, allowNull: true },
    website_type: { type: DataTypes.INTEGER, allowNull: false },
    usertype: { type: DataTypes.INTEGER, allowNull: false },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    last_name: {
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
    mobile: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [10, 10] },
    },
    landline: { type: DataTypes.STRING, allowNull: true },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    pincode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: { isNumeric: true, len: [6, 6] },
    },
    aadhar_number: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
      validate: { isNumeric: true, len: [12, 12] },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { notEmpty: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true, len: [6, 255] },
    },
    status: { type: DataTypes.INTEGER, defaultValue: true },
    isblocked: { type: DataTypes.INTEGER, defaultValue: false },
    token: { type: DataTypes.STRING, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    activate_token: { type: DataTypes.STRING, allowNull: false },
    activated_date: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.TIME },
    updated_at: { type: DataTypes.TIME },
  },
  {
    timestamps: false,
    tableName: "clients",
    // hooks: {
    //   beforeCreate: (client) => {
    //     client.password = bcrypt.hashSync(client.password, 10);
    //   },
    // },
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
      "Account not activated. Please check your email for activation account.!!"
    );
  }

  const isMatch = await bcrypt.compare(clientPassword, client.password);
  if (!isMatch) {
    throw new Error("Incorrect password");
  }
  return client;
};

const generateAuthToken = async (client) => {
  const token = jwt.sign(
    { id: client.id.toString(), email: client.email.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const checkDuplicateClient = async (data) => {
  const errors = {};
  const userEmail = await Client.findOne({ where: { email: data.email } });
  if (userEmail) {
    errors.email = "Email already been taken, Please provide a valid email.!!";
  }

  const userMobile = await Client.findOne({ where: { mobile: data.mobile } });
  if (userMobile) {
    errors.mobile =
      "Mobile already been taken, Please provide a valid mobile.!!";
  }

  const userAadhaar = await Client.findOne({
    where: { aadhar_number: data.aadhar_number },
  });

  if (userAadhaar) {
    errors.aadhar_number = "Aadhaar already been taken.!!";
  }

  return {
    isDuplicate: Object.keys(errors).length === 0,
    errors,
  };
};

Client.findByCredential = findByCredential;
Client.generateUsername = generateUsername;
Client.generateAuthToken = generateAuthToken;
Client.checkDuplicateClient = checkDuplicateClient;
module.exports = { Client };
