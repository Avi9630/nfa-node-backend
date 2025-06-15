const jwt = require("jsonwebtoken");
const { Client } = require("../models/Client");
const responseHelper = require("../helpers/responseHelper");

const Auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const client = await Client.findOne({
      where: { id: decode.id, token: token },
    });
    if (!client) {
      throw new Error("Unauthorized user.!!");
    }
    req.user = client;
    next();
  } catch (error) {
    responseHelper(res, "unauthorized", { error });
  }
};
module.exports = Auth;
