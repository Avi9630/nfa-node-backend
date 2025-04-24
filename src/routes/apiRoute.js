const ClientController = require("../controllers/clientController");
const Auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();

// LOGIN - REGISTER
router.get("/get-user-type", ClientController.getUserType);
router.post("/register", ClientController.register);
router.post("/login", ClientController.login);

//ACTIVATE-ACCOUNT
router.get("/verify/:token", ClientController.activateAccount);

//VERIFY-EMAIL && RESET-PASSWORD
router.post("/verify-email", ClientController.verifyEmail);
router.post("/reset-Password", ClientController.resetPassword);
router.post("/verify-otp", ClientController.verifyOtp);
router.post("/change-Password", ClientController.changePassword);

//CLIENTS
router.get("/get-client-details", Auth, ClientController.getClientDetails);
// router.get("/delete-entry/:id", ClientController.entryDelete);
// router.get("entry-list", ClientController.entryList);
// router.post("logout", ClientController.logout);

module.exports = router;
