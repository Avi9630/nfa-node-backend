var validator = require("validator");
const { Client } = require("../models/Client");

const ClientSchema = {
  validateInput: (data) => {
    const errors = {};

    const trimmedData = Object.keys(data).reduce((acc, key) => {
      acc[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
      return acc;
    }, {});

    // First Name
    if (
      !trimmedData.first_name ||
      validator.isEmpty(trimmedData.first_name.trim())
    ) {
      errors.first_name = "First name is required.!!";
    }

    //Last Name
    if (
      !trimmedData.last_name ||
      validator.isEmpty(trimmedData.last_name.trim())
    ) {
      errors.last_name = "Last name is required.!!";
    }

    // Email
    if (
      !trimmedData.email ||
      validator.isEmpty(String(trimmedData.email).trim())
    ) {
      errors.email = "Email is required.!!";
    } else if (!validator.isEmail(String(trimmedData.email).trim())) {
      errors.email = "Invalid email format.!!";
    }

    // Mobile
    if (!trimmedData.mobile || validator.isEmpty(trimmedData.mobile.trim())) {
      errors.mobile = "Mobile is required.!!";
    } else if (!validator.isMobilePhone(trimmedData.mobile, "en-IN")) {
      errors.mobile = "Mobile must be a valid 10-digit Indian number.!!";
    }

    // Pincode
    if (!trimmedData.pincode || validator.isEmpty(trimmedData.pincode.trim())) {
      errors.pincode = "Pincode is required.!!";
    } else if (!validator.matches(trimmedData.pincode, /^\d{6}$/)) {
      errors.pincode = "Pincode must be 6 digits.!!";
    }

    // Aadhar Number
    if (
      !trimmedData.aadhar_number ||
      validator.isEmpty(trimmedData.aadhar_number.trim())
    ) {
      errors.aadhar_number = "Aadhar number is required.!!";
    } else if (!validator.matches(trimmedData.aadhar_number, /^\d{12}$/)) {
      errors.aadhar_number = "Aadhar must be 12 digits.!!";
    }

    // Address
    if (!trimmedData.address || validator.isEmpty(trimmedData.address.trim())) {
      errors.address = "Address is required.!!";
    }

    // Usertype (1 or 2 only)
    if (
      !trimmedData.usertype ||
      !["1", "2"].includes(String(trimmedData.usertype))
    ) {
      errors.usertype = "Usertype must be either 1 or 2.!!";
    }

    // Captcha
    if (!trimmedData.captcha || validator.isEmpty(trimmedData.captcha.trim())) {
      errors.captcha = "Captcha is required.!!";
    }

    // Password
    if (
      !trimmedData.password ||
      validator.isEmpty(String(trimmedData.password).trim())
    ) {
      errors.password = "Password is required.!!";
    } else if (!validator.isLength(trimmedData.password.trim(), { min: 6 })) {
      errors.password = "Password must be at least 6 characters.!!";
    }

    // Confirm password
    if (
      !trimmedData.password_confirmation ||
      validator.isEmpty(trimmedData.password_confirmation.trim())
    ) {
      errors.password_confirmation = "Password confirmation is required.!!";
    } else if (
      trimmedData.password.trim() !== trimmedData.password_confirmation.trim()
    ) {
      errors.password_confirmation =
        "Password confirmation must match password.!!";
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
      errors.aadhar_number = "Aadhaar already been taken.!!";
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
module.exports = ClientSchema;
