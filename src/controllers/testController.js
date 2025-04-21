const responseHelper = require("../helpers/responseHelper");

const testing = async (req, res) => {
  try {
    responseHelper(res, "success", { data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = { testing };
