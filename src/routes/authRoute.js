const NfaNonFeatureController = require("../controllers/nfaNonFeatureController");
const NfaFeatureController = require("../controllers/nfaFeatureController");
const ProducerController = require("../controllers/producerController");
const ClientController = require("../controllers/clientController");
const express = require("express");
const router = express.Router();

//**************************8CLIENTS*******************************
router.get("/get-client-details", ClientController.getClientDetails);
router.get("/delete-entry/:id", ClientController.entryDelete);
router.get("/entry-list", ClientController.entryList);
// router.post("/logout", ClientController.logout);

// FEATURE
router.post("/feature-entry", NfaFeatureController.Entry);
router.post("/feature-final-submit", NfaFeatureController.finalSubmit);
// router.get("/feature-entry-by/:id", NfaFeatureController.featureById);

//***********************NON-FEATURE********************************
router.post("/non-feature-entry", NfaNonFeatureController.Entry);
router.post("/non-feature-final-submit", NfaNonFeatureController.finalSubmit);
// router.get("/non-feature-entry-by/:id", NfaFeatureController.nonFeatureById);

//*********************BEAST BOOK CINEMA ENTRY***********************
// router.post("/best-book-cinema-entry", BestBookCinemaController.Entry);
// router.post(
//   "/best-book-cinema-final-submit",
//   BestBookCinemaController.finalSubmit
// );
// router.get(
//   "/best-book-cinema-entry-by/:id",
//   BestBookCinemaController.bestBookById
// );

//*********************BEST FILM CRITIC*******************************
// router.post("/best-film-critic-entry", BestFilmCriticController.Entry);
// router.post(
//   "/best-film-critic-final-submit",
//   BestFilmCriticController.finalSubmit
// );
// router.get(
//   "/best-film-critic-entry-by/:id",
//   BestFilmCriticController.bestFilmCriticById
// );

//**************************PRODUCER**********************************
router.post("/store-producer", ProducerController.storeProducer);
// router.post("/update-producer", ProducerController.updateProducer);
// router.get("/list-producer", ProducerController.listProducer);
// router.get("/get-producer-by/:id", ProducerController.getProducer);
// router.get("/delete-producer/:id", ProducerController.deleteProducer);

//**************************DIRECTOR**********************************
// router.get("/store-director", directorController.storeDirector);
// router.get("/update-director", directorController.updateDirector);
// router.get("/list-director", directorController.listDirector);
// router.get("/get-director-by/:id", directorController.getDirector);
// router.get("/delete-director/:id", directorController.deleteDirector);

module.exports = router;
