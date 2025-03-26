const { Client } = require("../models/Client");
const { validator } = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const nodemailer = require("nodemailer");
require("dotenv").config();

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const generateToken = (client) =>
  jwt.sign({ id: client.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

module.exports = {
  register: async (req, res) => {
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
    } = req.body;

    let errors = [];

    // Manual Validation Using Validator
    if (!first_name || validator.isEmpty(first_name)) {
      errors.push({ field: "first_name", message: "First name is required" });
    }

    console.log(req.body); // Debugging
    debugger;

    if (!last_name || validator.isEmpty(last_name)) {
      errors.push({ field: "last_name", message: "Last name is required" });
    }

    if (!email || !validator.isEmail(email)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }

    if (!mobile || !validator.isNumeric(mobile) || mobile.length !== 10) {
      errors.push({ field: "mobile", message: "Mobile must be 10 digits" });
    }

    if (!pincode || !validator.isNumeric(pincode) || pincode.length !== 6) {
      errors.push({ field: "pincode", message: "Pincode must be 6 digits" });
    }

    if (
      !aadhar_number ||
      !validator.isNumeric(aadhar_number) ||
      aadhar_number.length !== 12
    ) {
      errors.push({
        field: "aadhar_number",
        message: "Aadhar must be 12 digits",
      });
    }
    if (!password || !validator.isLength(password, { min: 6 })) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      // Check if email already exists
      const existingClient = await Client.findOne({ where: { email } });
      console.log(existingClient);
      debugger;

      if (existingClient) {
        return res.status(400).json({ message: "Email already exists" });
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

      // Send verification email
      //   const mailOptions = {
      //     from: process.env.EMAIL,
      //     to: email,
      //     subject: "Verify Your Registration",
      //     text: `Your activation token: ${activateToken}`,
      //   };
      //   await transporter.sendMail(mailOptions);

      res.status(201).json({
        message:
          "User registered successfully. Please check your email for activation.",
        client,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  activateAccount: async (req, res) => {
    const { token } = req.params;
    try {
      const client = await Client.findOne({ where: { activate_token: token } });
      if (!client)
        return res.status(400).json({ message: "Invalid activation token" });

      await client.update({ active: true, activated_date: new Date() });
      res.status(200).json({ message: "Account activated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const client = await Client.findOne({ where: { email } });
      if (!client)
        return res.status(400).json({ message: "Invalid email or password" });
      if (!client.active)
        return res
          .status(400)
          .json({ message: "Please activate your account" });

      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid email or password" });

      const token = generateToken(client);
      res.json({ access_token: token, user: client });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};
