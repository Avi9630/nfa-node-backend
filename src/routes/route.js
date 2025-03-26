const express = require("express");
const router = express.Router();
const { testing } = require("../controllers/testController");
const clientController = require("../controllers/clientController");

router.get("/testing", testing);
router.post("/register", clientController.register);
module.exports = router;
