const responseHelper = require("../helpers/responseHelper");
const Constant = require("../libraries/Constant");

const CommonController = {
  getUserType: (req, res) => {
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
};
module.exports = CommonController;
