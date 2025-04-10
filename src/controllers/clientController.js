const { validateRegisterInput } = require("../helpers/validation_schema");
const { Client, generateUsername } = require("../models/Client");
const Constant = require("../libraries/Constant");
const bcrypt = require("bcryptjs");
const Mail = require("../mailer/Mail");

// const generateOTP = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  const { isValid, errors } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const userEmail = await Client.findOne({
      where: { email: req.body.email },
    });

    if (userEmail) {
      return res.status(404).json({
        error: "Email already been taken, Please provide valid email.!!",
      });
    }

    const userMobile = await Client.findOne({
      where: { mobile: req.body.mobile },
    });

    if (userMobile) {
      return res.status(404).json({
        error: "Mobile already been taken, Please provide valid Mobile.!!",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const username = await generateUsername(req.body.usertype);
    const types = Constant.websiteType()["NFA"];

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
      activate_token: await Constant.generateToken(60),
      website_type: Constant.websiteType()["NFA"],
      password: req.body.password,
    };

    const mailContent = {
      To: req.body.email,
      Subject:
        "Verify Your Registration for National Film Awards Online Submission (NFA)",
      Data: {
        clientName: newClient.first_name + " " + newClient.last_name,
        clientEmail: newClient.email,
        activateToken: newClient.activate_token,
      },
    };
    const mail = await Mail.sendMail(mailContent);
    const client = await Client.create(newClient);
    res.status(201).json({
      status: true,
      message:
        "Thank you for National Film Award (NFA) registration. Please click on the link sent to your email for verification process.!!",
    });
  } catch (error) {
    // if (error.isJoi === true) error.status = 422;
    // if (error.name === "SequelizeUniqueConstraintError") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Duplicate entry: Email or Aadhar number already exists.",
    //   });
    // }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserType = async (req, res) => {
  try {
    const types = Constant.userType();
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
