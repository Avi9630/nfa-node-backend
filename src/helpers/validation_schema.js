const Joi = require("joi");

const registerSchema = Joi.object({
  first_name: Joi.string().trim().required(),
  last_name: Joi.string().trim().required(),
  email: Joi.string().trim().email().lowercase().required(),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  landline: Joi.string().allow("").optional(),
  address: Joi.string().trim().required(),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
  aadhar_number: Joi.string()
    .pattern(/^\d{12}$/)
    .required(),
  usertype: Joi.number().integer().valid(1, 2).required(),
  captcha: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
  password_confirmation: Joi.string().valid(Joi.ref("password")).required(),
  // username: Joi.string().allow("").optional(),
});

// const registerSchema = Joi.object({
//     first_name: Joi.string().trim().required().messages({
//       "string.empty": "First name is required",
//     }),
//     last_name: Joi.string().trim().required().messages({
//       "string.empty": "Last name is required",
//     }),
//     email: Joi.string().trim().email().required().messages({
//       "string.email": "Invalid email format",
//       "string.empty": "Email is required",
//     }),
//     mobile: Joi.string()
//       .pattern(/^\d{10}$/)
//       .required()
//       .messages({
//         "string.pattern.base": "Mobile must be 10 digits",
//         "string.empty": "Mobile is required",
//       }),
//     pincode: Joi.string()
//       .pattern(/^\d{6}$/)
//       .required()
//       .messages({
//         "string.pattern.base": "Pincode must be 6 digits",
//         "string.empty": "Pincode is required",
//       }),
//     aadhar_number: Joi.string()
//       .pattern(/^\d{12}$/)
//       .required()
//       .messages({
//         "string.pattern.base": "Aadhar must be 12 digits",
//         "string.empty": "Aadhar number is required",
//       }),
//     address: Joi.string().trim().required().messages({
//       "string.empty": "Address is required",
//     }),
//     usertype: Joi.number().integer().valid(1, 2).required().messages({
//       "any.only": "Usertype must be either 1 or 2",
//       "number.base": "Usertype must be an integer",
//       "number.integer": "Usertype must be an integer",
//     }),
//     captcha: Joi.string().trim().required().messages({
//       "string.empty": "Captcha is required",
//     }),
//     password: Joi.string().min(6).required().messages({
//       "string.min": "Password must be at least 6 characters",
//       "string.empty": "Password is required",
//     }),
//     password_confirmation: Joi.string()
//       .valid(Joi.ref("password"))
//       .required()
//       .messages({
//         "any.only": "Password confirmation must match password",
//         "string.empty": "Confirm password is required",
//       }),
//     landline: Joi.string().allow("").optional(),
//     username: Joi.string().allow("").optional(),
//   });

module.exports = { registerSchema };
