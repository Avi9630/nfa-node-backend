const testController = require("../controllers/testController");
const express = require("express");
const router = express.Router();

router.get("/testing", testController.testing);
module.exports = router;
