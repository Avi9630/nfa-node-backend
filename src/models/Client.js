const { DataTypes } = require("sequelize");
const sequelize = require("../models");
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
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
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
    landline: { type: DataTypes.STRING, allowNull: true },
    usertype: { type: DataTypes.INTEGER, allowNull: false },
    website_type: { type: DataTypes.INTEGER, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: false },
    activated_date: { type: DataTypes.DATE, allowNull: true },
    activate_token: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
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

Client.findByCredential = findByCredential;
Client.generateUsername = generateUsername;
Client.generateAuthToken = generateAuthToken;
// module.exports = { Client, generateUsername };
module.exports = { Client };
