const SCHEMA = require("../helpers/validation_schema");
const responseHelper = require("../helpers/responseHelper");
const Constant = require("../libraries/Constant");
const { Client } = require("../models/Client");
const { Twoauth } = require("../models/Twoauth");
// const { Client, Twoauth } = require("../models");
const Mail = require("../mailer/Mail");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { NfaFeature } = require("../models/NfaFeature");
const { NfaNonFeature } = require("../models/NfaNonFeature");

const ClientController = {
  getUserType: async (req, res) => {
    try {
      const types = Constant.userType();
      return responseHelper(res, "success", {
        message: "User types fetched successfully.!!",
        data: types,
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    const { isValid, errors } = SCHEMA.validateVerifyEmailInput(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }
    try {
      const client = await Client.findOne({ where: { email: req.body.email } });
      if (!client) {
        responseHelper(res, "exception", {
          message: "No account found with this email address.!!",
        });
      }
      return responseHelper(res, "success", {
        message: "Email verified successfully.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  register: async (req, res) => {
    const { isValid, errors } = SCHEMA.validateInput(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }
    const { isValid: isDuplicateValid, errors: duplicateErrors } =
      await SCHEMA.checkDuplicateClient(req.body);

    if (!isDuplicateValid) {
      return responseHelper(res, "validatorerrors", { duplicateErrors });
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
      return responseHelper(res, "created", {
        message:
          "Thank you for National Film Award (NFA) registration. Please click on the link sent to your email for verification process.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  activateAccount: async (req, res) => {
    const { token } = req.params;
    try {
      const client = await Client.findOne({ where: { activate_token: token } });

      if (!client) {
        return responseHelper(res, "tokenexp", { message: "Invalid token" });
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
      return responseHelper(res, "success", {
        message: "Account has been activated successfully.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  login: async (req, res) => {
    const { isValid, errors } = SCHEMA.loginValidate(req.body);

    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
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
      client.token = token;
      if (client.save()) {
        return responseHelper(res, "success", { authorization, data: client });
      }
      // 2nd way to update user
      // await client.update({ token });

      return responseHelper(res, "exception", {
        message: "Something went wrong!! Please contact tech support.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { isValid, errors } = SCHEMA.resetPasswordValidate(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const OTP = Twoauth.generateOtp();

      const client = await Client.findOne({ where: { email: req.body.email } });
      if (!client) {
        return responseHelper(res, "notvalid");
      }

      const twoauth = await Twoauth.findOne({ where: { email: client.email } });

      if (!twoauth) {
        twoauth = await Twoauth.create({
          client_id: client.id,
          mobile: client.mobile,
          email: client.email,
          authcode: OTP,
          is_verifed: "0",
          ipaddress: req.ip,
          date: moment().format("YYYY-MM-DD"),
        });
      } else {
        twoauth.client_id = client.id;
        twoauth.authcode = OTP;
        twoauth.is_verifed = "0";
        twoauth.ipaddress = req.ip;
        twoauth.date = moment().format("YYYY-MM-DD");
        await twoauth.save();
      }

      const mailContent = {
        To: req.body.email,
        Subject: "National Film Awards (NFA) Password Reset - One Time Code",
        Data: {
          clientName: client.first_name + " " + client.last_name,
          otp: OTP,
        },
      };
      await Mail.sendOtp(mailContent);
      return responseHelper(res, "success", {
        message: "An OTP has been sent to your registered email address.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { error: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    const { isValid, errors } = SCHEMA.verifyOtpValidate(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const client = await Client.findOne({ where: { email: req.body.email } });

      if (!client) {
        return responseHelper(res, "exception", {
          message: "User Not found.!!",
        });
      }

      const authdata = await Twoauth.findOne({
        where: { client_id: client.id, email: client.email, is_verifed: 0 },
      });

      if (!authdata) {
        return responseHelper(res, "exception", {
          message: "OTP not matched!!, Please resend OTP!!",
        });
      }

      if (authdata.authcode !== req.body.otp) {
        return responseHelper(res, "exception", {
          message: "Invalid OTP entered.!!",
        });
      }

      // Updating OTP verification status
      const [updated] = await Twoauth.update(
        { is_verifed: "1" },
        { where: { id: authdata.id } }
      );

      if (updated === 1) {
        return res.status(200).json({
          status: "success",
          message: "OTP verified successfully!",
        });
      }
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  changePassword: async (req, res) => {
    const { isValid, errors } = SCHEMA.changePasswordValidate(req.body);
    if (!isValid) {
      return responseHelper(res, "validatorerrors", { errors });
    }

    try {
      const client = await Client.findOne({ where: { email: req.body.email } });
      if (!client) {
        return responseHelper(res, "exception", {
          message: "User not found.!!",
        });
      }

      const isMatch = await bcrypt.compare(req.body.password, client.password);
      if (isMatch) {
        return responseHelper(res, "incorrectinfo", {
          message: "Password can not be same as previous password.!!",
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      client.password = hashedPassword;

      await client.save(); // ✅ await it

      return responseHelper(res, "success", {
        message: "Password updated successfully.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  getClientDetails: async (req, res) => {
    responseHelper(res, "success", {
      message: "Loggedin client details.!!",
      data: req.user,
    });
  },

  entryDelete: async (req, res) => {
    try {
      nfaFeature = await NfaFeature.findOne({
        where: { id: req.params.id, client_id: req.user.id },
      });
      if (!nfaFeature) {
        throw Error("Records not found.!!");
      }
      await nfaFeature.delete();
      responseHelper(res, "success", { message: "Deleted successfully.!!" });
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  entryList: async (req, res) => {
    try {
      if (req.user.usertype === 1) {
        feature = await NfaFeature.findAll({
          where: { client_id: req.user.id },
        });
        nonFeature = await NfaNonFeature.findAll({
          where: { client_id: req.user.id },
        });

        // data.feature = feature;
        // data.nonFeature = nonFeature;

        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: {
            Feature: feature,
            "Non Feature": nonFeature,
          },
        });
      }

      if (req.user.usertype === 2) {
        // feature = await NfaFeature.findAll({
        //   where: { client_id: req.user.id },
        // });
        // nonFeature = await NfaNonFeature.findAll({
        //   where: { client_id: req.user.id },
        // });

        data.bestBook = {};
        data.bestFilmCritic = {};

        responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: data,
        });
      }

      throw Error("User not valid.!!");
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },
};
module.exports = ClientController;
