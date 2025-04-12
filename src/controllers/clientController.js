const ValidateRegister = require("../helpers/validation_schema");
const { Client, generateUsername } = require("../models/Client");
const Constant = require("../libraries/Constant");
const bcrypt = require("bcryptjs");
const Mail = require("../mailer/Mail");

const ClientController = {
  getUserType: async (req, res) => {
    try {
      const types = Constant.userType();
      res.status(200).json({
        status: true,
        message: "User types fetched successfully",
        data: types,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  register: async (req, res) => {
    const { isValid, errors } = ValidateRegister.validateInput(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const { isValid: isDuplicateValid, errors: duplicateErrors } =
      await ValidateRegister.checkDuplicateClient(req.body);

    if (!isDuplicateValid) {
      return res.status(400).json({ errors: duplicateErrors });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 8);
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
        activate_token: await Constant.generateToken(100),
        website_type: Constant.websiteType()["NFA"],
        password: hashedPassword,
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
      await Mail.registerMail(mailContent);
      await Client.create(newClient);
      res.status(201).json({
        status: true,
        message:
          "Thank you for National Film Award (NFA) registration. Please click on the link sent to your email for verification process.!!",
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  activateAccount: async (req, res) => {
    const { token } = req.params;

    try {
      const client = await Client.findOne({ where: { activate_token: token } });

      if (!client) {
        return res.status(400).json({
          status: false,
          message: "Invalid token",
          error: error.message,
        });
      }

      const dataToUpdate = {
        active: 1,
        activated_date: new Date().toISOString().split("T")[0],
      };
      await client.update(dataToUpdate);
      const mailContent = {
        To: client.email,
        Subject: "Welcome to National Film Awards (NFA)",
        Data: {
          clientName: `${client.first_name} ${client.last_name}`,
          clientEmail: client.email,
        },
      };
      await Mail.accountActivationMail(mailContent);
      return res.status(200).json({
        status: true,
        message: "Account has been activated successfully.!",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Account not activated, Please re-submit.!",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    const { isValid, errors } = ValidateRegister.loginValidate(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const client = await Client.findOne({ where: { email: req.body.email } });
    if (!client) {
      return res.status(400).json({
        status: false,
        message: "Records not found.!!",
        error: error.message,
      });
    }
    if (!client.active) {
      res.status(400).json({
        status: false,
        message: "Please activate your account.!!",
      });
    }
    console.log(client.active);

    //   if (!$client->active) {
    //     $response = [
    //         'message' => 'Please activate your account',
    //     ];
    //     return $this->response('validatorerrors', $response);
    // }
  },
};
module.exports = ClientController;
