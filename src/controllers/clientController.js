const db = require("../config/database");
const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (client) =>
  jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const registerSchema = Joi.object({
  first_name: Joi.string().trim().required().messages({
    "string.empty": "First name is required",
  }),
  last_name: Joi.string().trim().required().messages({
    "string.empty": "Last name is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile must be 10 digits",
      "string.empty": "Mobile is required",
    }),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be 6 digits",
      "string.empty": "Pincode is required",
    }),
  aadhar_number: Joi.string()
    .pattern(/^\d{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhar must be 12 digits",
      "string.empty": "Aadhar number is required",
    }),
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
  }),
  usertype: Joi.number().integer().valid(1, 2).required().messages({
    "any.only": "Usertype must be either 1 or 2",
    "number.base": "Usertype must be an integer",
    "number.integer": "Usertype must be an integer",
  }),
  captcha: Joi.string().trim().required().messages({
    "string.empty": "Captcha is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  password_confirmation: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Password confirmation must match password",
      "string.empty": "Confirm password is required",
    }),
  landline: Joi.string().allow("").optional(),
  username: Joi.string().allow("").optional(),
});

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
  const {
    first_name,
    last_name,
    email,
    mobile,
    pincode,
    aadhar_number,
    landline,
    address,
    usertype,
    password,
    captcha,
    password_confirmation,
    username,
  } = req.body;

  try {
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Email already been taken, Please provide" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = `USR${Math.floor(1000 + Math.random() * 9000)}`;
    const activateToken = Math.random().toString(36).substr(2, 10); // Generate token

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
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { register };
