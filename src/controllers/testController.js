const responseHelper = require("../helpers/responseHelper");

const testing = async (req, res) => {
  try {
    return responseHelper(res, "success", {});
  } catch (error) {
    return responseHelper(res, "exception", {
      message: error.message,
    });
  }
};

module.exports = { testing };
