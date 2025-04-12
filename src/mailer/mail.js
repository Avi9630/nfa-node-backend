const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const Mail = {
  registerMail: async (mailContent) => {
    const { To, Subject, Data } = mailContent;
    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL ?? "http://119.82.68.149/festival/";

    // Path to the EJS template
    const templatePath = path.join(
      __dirname,
      "templates",
      "verify-registration.ejs"
    );

    const htmlContent = await ejs.renderFile(templatePath, {
      ...Data,
      frontendBaseUrl,
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_FROM_ADDRESS,
        to: To,
        subject: Subject,
        html: htmlContent,
      });
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  accountActivationMail: async (mailContent) => {
    const { To, Subject, Data } = mailContent;
    const frontendBaseUrl =
      process.env.FRONTEND_BASE_URL ?? "http://119.82.68.149/festival/";

    // Path to the EJS template
    const templatePath = path.join(
      __dirname,
      "templates",
      "activation-mail.ejs"
    );

    const htmlContent = await ejs.renderFile(templatePath, {
      ...Data,
      frontendBaseUrl,
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: To,
        subject: Subject,
        html: htmlContent,
      });
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};

module.exports = Mail;
