const { validateRegisterInput } = require("../helpers/validation_schema");
const { Client, generateUsername } = require("../models/Client");
const constant = require("../libraries/constant");
const db = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (client) =>
  jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const register = async (req, res) => {
  const { isValid, errors } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await Client.findOne({ where: { email: req.body.email } });

    if (user) {
      return res.status(404).json({
        error: "Email already been taken, Please provide valid email.!!",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const username = await generateUsername(req.body.usertype);
    const newClient = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      mobile: req.body.mobile,
      pincode: req.body.pincode,
      aadhar_number: req.body.aadhar_number,
      landline: req.body.landline ?? "",
      address: req.body.address ?? "",
      usertype: req.body.usertype,
      captcha: req.body.captcha,
      username: username,
      active: 0,
      // activate_token:substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($this->length / strlen($x)))), 1, $this->length),
      // website_type:Constant::websiteType()['NFA'],
      password: hashedPassword,
    };

    console.log(newClient);
    return;

    // Generate activation token
    // const activateToken = Math.random().toString(36).substr(2, 10);

    const client = await Client.create({
      first_name,
      last_name,
      email,
      mobile,
      pincode,
      aadhar_number,
      landline,
      address,
      usertype,
      username,
      password: hashedPassword,
      active: false,
      activate_token: activateToken,
    });
    res.status(201).json({
      message:
        "User registered successfully. Please check your email for activation.",
      client,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry: Email or Aadhar number already exists.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserType = async (req, res) => {
  try {
    const types = await constant.userType();
    res.status(200).json({
      success: true,
      message: "User types fetched successfully",
      data: types,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { register, getUserType };
