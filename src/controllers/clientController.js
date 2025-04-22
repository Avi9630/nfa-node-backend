const ValidateRegister = require("../helpers/validation_schema");
const responseHelper = require("../helpers/responseHelper");
const Constant = require("../libraries/Constant");
const { Client } = require("../models/Client");
const Mail = require("../mailer/Mail");
const bcrypt = require("bcryptjs");

const ClientController = {
  getUserType: async (req, res) => {
    try {
      const types = Constant.userType();
      responseHelper(res, "success", {
        message: "User types fetched successfully.!!",
        data: types,
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    const { isValid, errors } = ValidateRegister.validateVerifyEmailInput(
      req.body
    );
    if (!isValid) {
      responseHelper(res, "validatorerrors", { errors });
    }
    try {
      const client = await Client.findOne({ where: { email: req.body.email } });
      if (!client) {
        throw new Error("No account found with this email address.!!");
      }
      responseHelper(res, "success", {
        message: "Email verified successfully.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  register: async (req, res) => {
    const { isValid, errors } = ValidateRegister.validateInput(req.body);

    if (!isValid) {
      responseHelper(res, "validatorerrors", { errors });
    }
    const { isValid: isDuplicateValid, errors: duplicateErrors } =
      await ValidateRegister.checkDuplicateClient(req.body);

    if (!isDuplicateValid) {
      responseHelper(res, "validatorerrors", { duplicateErrors });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const username = await Client.generateUsername(req.body.usertype);
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
      responseHelper(res, "created", {
        message:
          "Thank you for National Film Award (NFA) registration. Please click on the link sent to your email for verification process.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  activateAccount: async (req, res) => {
    const { token } = req.params;
    try {
      const client = await Client.findOne({ where: { activate_token: token } });

      if (!client) {
        responseHelper(res, "tokenexp", { message: "Invalid token" });
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
      responseHelper(res, "success", {
        message: "Account has been activated successfully.!!",
      });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  login: async (req, res) => {
    const { isValid, errors } = ValidateRegister.loginValidate(req.body);

    if (!isValid) {
      responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const client = await Client.findByCredential(
        req.body.email,
        req.body.password
      );

      const token = await Client.generateAuthToken(client);
      const authorization = {
        access_token: token,
        token_type: "bearer",
        expires_in: "1h",
      };

      // 1st to update user

      // client.token = token;
      // await client.save();

      // 2nd way to update user

      await client.update({ token });
      responseHelper(res, "success", { authorization, data: client });
    } catch (error) {
      responseHelper(res, "exception", { error: error.message });
    }
  },
};
module.exports = ClientController;
