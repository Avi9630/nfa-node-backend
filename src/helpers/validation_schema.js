const Joi = require("joi");
var validator = require("validator");
const { Client } = require("../models/Client");

const ValidateRegister = {
  validateInput: (data) => {
    const errors = {};

    // First Name
    if (!data.first_name || validator.isEmpty(data.first_name.trim())) {
      errors.first_name = "First name is required";
    }

    //Last Name
    if (!data.last_name || validator.isEmpty(data.last_name.trim())) {
      errors.first_name = "Last name is required";
    }

    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required.!!";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }

    // // Email
    // if (!data.email || validator.isEmpty(String(data.email).trim())) {
    //   errors.email = "Email is required";
    // } else if (!validator.isEmail(String(data.email).trim())) {
    //   errors.email = "Invalid email format";
    // }

    // Mobile
    if (!data.mobile || validator.isEmpty(data.mobile.trim())) {
      errors.mobile = "Mobile is required";
    } else if (!validator.isMobilePhone(data.mobile, "en-IN")) {
      errors.mobile = "Mobile must be a valid 10-digit Indian number";
    }

    // Pincode
    if (!data.pincode || validator.isEmpty(data.pincode.trim())) {
      errors.pincode = "Pincode is required";
    } else if (!validator.matches(data.pincode, /^\d{6}$/)) {
      errors.pincode = "Pincode must be 6 digits";
    }

    // Aadhar Number
    if (!data.aadhar_number || validator.isEmpty(data.aadhar_number.trim())) {
      errors.aadhar_number = "Aadhar number is required";
    } else if (!validator.matches(data.aadhar_number, /^\d{12}$/)) {
      errors.aadhar_number = "Aadhar must be 12 digits";
    }

    // Address
    if (!data.address || validator.isEmpty(data.address.trim())) {
      errors.address = "Address is required";
    }

    // Usertype (1 or 2 only)
    if (!data.usertype || !["1", "2"].includes(String(data.usertype))) {
      errors.usertype = "Usertype must be either 1 or 2";
    }

    // Captcha
    if (!data.captcha || validator.isEmpty(data.captcha.trim())) {
      errors.captcha = "Captcha is required";
    }

    // Password
    if (!data.password || validator.isEmpty(String(data.password).trim())) {
      errors.password = "Password is required";
    } else if (!validator.isLength(data.password.trim(), { min: 6 })) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password
    if (
      !data.password_confirmation ||
      validator.isEmpty(data.password_confirmation.trim())
    ) {
      errors.password_confirmation = "Password confirmation is required";
    } else if (data.password.trim() !== data.password_confirmation.trim()) {
      errors.password_confirmation =
        "Password confirmation must match password";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  checkDuplicateClient: async (data) => {
    const errors = {};
    const userEmail = await Client.findOne({ where: { email: data.email } });
    if (userEmail) {
      errors.email =
        "Email already been taken, Please provide a valid email.!!";
    }
    const userMobile = await Client.findOne({ where: { mobile: data.mobile } });
    if (userMobile) {
      errors.mobile =
        "Mobile already been taken, Please provide a valid mobile.!!";
    }
    const userAadhaar = await Client.findOne({
      where: { aadhar_number: data.aadhar_number },
    });
    if (userAadhaar) {
      errors.aadhar_number = "Aadhaar already been taken.!!.";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  loginValidate: (data) => {
    const errors = {};

    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }

    // PASSWORD
    if (!data.password || validator.isEmpty(data.password)) {
      errors.password = "Password is required";
    } else if (!validator.isLength(data.password, { min: 6 })) {
      errors.password = "Password must be at least 6 characters";
    }

    //CAPTCHA
    if (!data.captcha || validator.isEmpty(data.captcha.trim())) {
      errors.captcha = "Captcha is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  resetPasswordValidate: (data) => {
    const errors = {};
    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  validateVerifyEmailInput: (data) => {
    const errors = {};
    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  verifyOtpValidate: (data) => {
    const errors = {};

    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required.!!";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }

    // OTP
    if (!data.otp || validator.isEmpty(String(data.otp).trim())) {
      errors.otp = "OTP is required.!!";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  changePasswordValidate: (data) => {
    const errors = {};

    // EMAIL
    if (!data.email || validator.isEmpty(String(data.email).trim())) {
      errors.email = "Email is required.!!";
    } else if (!validator.isEmail(String(data.email).trim())) {
      errors.email = "Invalid email format";
    }

    // Password
    if (!data.password || validator.isEmpty(String(data.password).trim())) {
      errors.password = "Password is required";
    } else if (!validator.isLength(data.password.trim(), { min: 6 })) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password
    if (
      !data.password_confirmation ||
      validator.isEmpty(data.password_confirmation.trim())
    ) {
      errors.password_confirmation = "Password confirmation is required";
    } else if (data.password.trim() !== data.password_confirmation.trim()) {
      errors.password_confirmation =
        "Password confirmation must match password";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// module.exports = { validateRegisterInput };
module.exports = ValidateRegister;
