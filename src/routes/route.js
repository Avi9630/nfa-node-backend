const testController = require("../controllers/testController");
const clientController = require("../controllers/clientController");
const express = require("express");
const router = express.Router();

router.get("/testing", testController.testing);
router.post("/register", clientController.register);
module.exports = router;
