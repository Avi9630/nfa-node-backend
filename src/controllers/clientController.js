const db = require("../config/database");
const Client = require("../models/Client");
// const bcrypt = require("bcryptjs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerSchema } = require("../helpers/validation_schema");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (client) =>
  jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const register = async (req, res) => {
  try {
    const result = await registerSchema.validateAsync(req.body);

    const existingClient = await Client.findOne({
      where: { email: result.email },
    });

    if (existingClient) {
      return res.status(400).json({
        message: "Email already been taken, Please provide valid email!!",
      });
    }

    // Destructure validated input
    const newClient = ({
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
      password,
    } = result);

    console.log(newClient);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate activation token
    const activateToken = Math.random().toString(36).substr(2, 10);

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

    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { register };
