const Joi = require("joi");

const ClientSchema = {
  registerSchema: (data) => {
    const schema = Joi.object({
      first_name: Joi.string().required().messages({
        "string.empty": "First name is required.",
        "any.required": "First name is required.",
      }),

      last_name: Joi.string().required().messages({
        "string.empty": "Last name is required.",
        "any.required": "Last name is required.",
      }),

      email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Enter a valid email address.",
        "any.required": "Email is required.",
      }),

      mobile: Joi.string()
        .pattern(/^[6-9]\d{9}$/)
        .required()
        .messages({
          "string.empty": "Mobile is required.",
          "string.pattern.base": "Enter a valid 10-digit mobile number.",
          "any.required": "Mobile is required.",
        }),

      address: Joi.string().required().messages({
        "string.empty": "Address is required.",
        "any.required": "Address is required.",
      }),

      pincode: Joi.string()
        .pattern(/^[1-9][0-9]{5}$/)
        .required()
        .messages({
          "string.empty": "Pincode is required.",
          "string.pattern.base": "Enter a valid 6-digit pincode.",
          "any.required": "Pincode is required.",
        }),

      aadhar_number: Joi.string()
        .pattern(/^[2-9]{1}[0-9]{11}$/)
        .required()
        .messages({
          "string.empty": "Aadhaar number is required.",
          "string.pattern.base": "Enter a valid 12-digit Aadhaar number.",
          "any.required": "Aadhaar number is required.",
        }),

      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long.",
      }),

      password_confirmation: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match.",
          "any.required": "Password confirmation is required.",
        }),

      usertype: Joi.number().valid(1, 2).required().messages({
        "any.only": "User type must be either 1 or 2.",
        "any.required": "User type is required.",
        "number.base": "User type must be a number.",
      }),

      captcha: Joi.string().required().messages({
        "string.empty": "Captcha is required.",
        "any.required": "Captcha is required.",
      }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  },

  validateEmail: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Enter a valid email address.",
        "any.required": "Email is required.",
      }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  },

  verifyOtpValidate: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Enter a valid email address.",
        "any.required": "Email is required.",
      }),
      otp: Joi.number().min(6).required().messages({
        "any.required": "OTP is required.",
        "number.base": "OTP must be a number.",
      }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  },

  changePasswordValidate: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Enter a valid email address.",
        "any.required": "Email is required.",
      }),
      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long.",
      }),

      password_confirmation: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
          "any.only": "Passwords do not match.",
          "any.required": "Password confirmation is required.",
        }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  },

  loginValidate: (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.empty": "Email is required.",
        "string.email": "Enter a valid email address.",
        "any.required": "Email is required.",
      }),

      password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 6 characters long.",
      }),

      captcha: Joi.string().required().messages({
        "string.empty": "Captcha is required.",
        "any.required": "Captcha is required.",
      }),
    });
    return schema.validate(data, { abortEarly: false, allowUnknown: true });
  },
};
module.exports = ClientSchema;
