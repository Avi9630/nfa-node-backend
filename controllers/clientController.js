const { NfaNonFeature } = require("../models/NfaNonFeature");
const responseHelper = require("../helpers/responseHelper");
const ClientSchema = require("../helpers/clientSchema");
const { NfaFeature } = require("../models/NfaFeature");
const Constant = require("../libraries/Constant");
const { Twoauth } = require("../models/Twoauth");
const { Client } = require("../models/Client");
const Mail = require("../mailer/Mail");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { BestBookCinema } = require("../models/BestBookCinema");
const { BestFilmCritic } = require("../models/BestFilmCritic");

const ClientController = {
  register: async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.registerSchema(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message),
      });
    }

    const { isDuplicate, errors } = await Client.checkDuplicateClient(req.body);
    if (!isDuplicate) {
      return responseHelper(res, "validatorerrors", {
        message: "Duplicate data found!",
        errors,
      });
    }

    try {
      const payload = {
        ...req.body,
      };

      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const username = await Client.generateUsername(payload.usertype);

      const newClient = {
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        mobile: payload.mobile,
        pincode: payload.pincode,
        aadhar_number: payload.aadhar_number,
        landline: payload.landline ?? null,
        address: payload.address ?? null,
        usertype: payload.usertype,
        captcha: payload.captcha,
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

  login: async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.loginValidate(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message.replace(/"/g, "")),
      });
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

      // client.token = token;
      // if (client.save()) {
      //   return responseHelper(res, "success", { authorization, data: client });
      // }

      // 2nd way to update user
      const clientUpdate = await client.update({ token });
      if (clientUpdate) {
        return responseHelper(res, "success", { authorization, data: client });
      }
      return responseHelper(res, "exception", {
        message: "Something went wrong!! Please contact tech support.!!",
      });
    } catch (error) {
      return responseHelper(res, "exception", { error: error.message });
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

  verifyEmail: async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.validateEmail(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message),
      });
    }

    try {
      const client = await Client.findOne({ where: { email: req.body.email } });

      if (client) {
        console.log(typeof client.active);
        if (client.active) {
          return responseHelper(res, "success", {
            message: "Email verified successfully.!!",
            data: 1,
          });
        }
        return responseHelper(res, "incorrectinfo", {
          message: "Account not activated.!!",
          data: 1,
        });
      } else {
        responseHelper(res, "exception", {
          message: "No account found with this email address.!!",
        });
      }
    } catch (error) {
      return responseHelper(res, "exception", { message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.validateEmail(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message),
      });
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
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.verifyOtpValidate(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message),
      });
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
    if (!req.body || Object.keys(req.body).length === 0) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: ["Request body is required"],
      });
    }

    const { error } = ClientSchema.changePasswordValidate(req.body);
    if (error) {
      return responseHelper(res, "validatorerrors", {
        message: "Validation error.!!",
        errors: error.details.map((err) => err.message),
      });
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

      await client.save();

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
        return responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: {
            Feature: feature,
            Non_Feature: nonFeature,
          },
        });
      } else if (req.user.usertype === 2) {
        bestBooks = await BestBookCinema.findAll({
          where: { client_id: req.user.id },
        });

        bestFilmCritic = await BestFilmCritic.findAll({
          where: { client_id: req.user.id },
        });
        return responseHelper(res, "success", {
          message: "Here are your records.!!",
          data: {
            Best_Books: bestBooks,
            Best_Film_Critic: bestFilmCritic,
          },
        });
      } else {
        throw Error("User not valid.!!");
      }
    } catch (error) {
      responseHelper(res, "exception", { message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      req.user.token = null;
      await req.user.save();
      responseHelper(res, "success", { message: "Logout successfully.!!" });
    } catch (errors) {
      responseHelper(res, "exception", { message: errors.message });
    }
  },
};
module.exports = ClientController;
