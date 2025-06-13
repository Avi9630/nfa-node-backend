const ClientController = require("../controllers/clientController");
const CommonController = require("../controllers/commonController");
const Auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();

//****************LOGIN-REGISTER-VERIFY-ACCOUNT-VERIFY-EMAIL && RESET-PASSWORD*************************//
router.post("/change-Password", ClientController.changePassword);
router.get("/verify/:token", ClientController.activateAccount);
router.post("/reset-Password", ClientController.resetPassword);
router.get("/get-user-type", CommonController.getUserType);
router.post("/verify-email", ClientController.verifyEmail);
router.post("/verify-otp", ClientController.verifyOtp);
router.post("/register", ClientController.register);
router.post("/login", ClientController.login);

//CLIENTS
// router.get("/get-client-details", Auth, ClientController.getClientDetails);
// router.get("/delete-entry/:id", ClientController.entryDelete);
// router.get("entry-list", ClientController.entryList);
// router.post("logout", ClientController.logout);

module.exports = router;
