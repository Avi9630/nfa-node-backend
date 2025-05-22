const BestBookCinemaController = require("../controllers/bestBookCinemaController");
const BestFilmCriticController = require("../controllers/bestFilmCriticController");
const NfaNonFeatureController = require("../controllers/nfaNonFeatureController");
const AudiographerController = require("../controllers/audiographerController");
const NfaFeatureController = require("../controllers/nfaFeatureController");
const ProducerController = require("../controllers/producerController");
const DirectorController = require("../controllers/directorController");
const ClientController = require("../controllers/clientController");
const EditorController = require("../controllers/editorController");
const ActorController = require("../controllers/actorController");
const SongController = require("../controllers/songController");
const BookController = require("../controllers/bookController");

const express = require("express");
const PaymentController = require("../controllers/PaymentController");
const router = express.Router();

//**************************CLIENTS*******************************//
router.get("/get-client-details", ClientController.getClientDetails);
router.get("/delete-entry/:id", ClientController.entryDelete);
router.get("/entry-list", ClientController.entryList);
router.post("/logout", ClientController.logout);

//************************FEATURE**********************************//
router.post("/feature-entry", NfaFeatureController.Entry);
router.post("/feature-final-submit", NfaFeatureController.finalSubmit);
router.get("/feature-entry-by/:id", NfaFeatureController.featureById);

//************************NON-FEATURE******************************//
router.post("/non-feature-entry", NfaNonFeatureController.Entry);
router.post("/non-feature-final-submit", NfaNonFeatureController.finalSubmit);
router.get("/non-feature-entry-by/:id", NfaNonFeatureController.nonFeatureById);

//**********************BEAST BOOK CINEMA ENTRY********************//
router.post("/best-book-cinema-entry", BestBookCinemaController.Entry);
router.post(
  "/best-book-cinema-final-submit",
  BestBookCinemaController.finalSubmit
);

router.get(
  "/best-book-cinema-entry-by/:id",
  BestBookCinemaController.bestBookById
);

//*********************BEST FILM CRITIC****************************//
router.post("/best-film-critic-entry", BestFilmCriticController.Entry);
router.post(
  "/best-film-critic-final-submit",
  BestFilmCriticController.finalSubmit
);

router.get(
  "/best-film-critic-entry-by/:id",
  BestFilmCriticController.bestFilmCriticById
);

//**************************PRODUCER*******************************//
router.post("/store-producer", ProducerController.storeProducer);
router.post("/update-producer", ProducerController.updateProducer);
router.post("/list-producer", ProducerController.listProducer);
router.get("/get-producer-by/:id", ProducerController.getProducer);
router.get("/delete-producer/:id", ProducerController.deleteProducer);

//**************************DIRECTOR*******************************//
router.post("/store-director", DirectorController.storeDirector);
router.post("/update-director", DirectorController.updateDirector);
router.post("/list-director", DirectorController.listDirector);
router.get("/get-director-by/:id", DirectorController.getDirector);
router.get("/delete-director/:id", DirectorController.deleteDirector);

//ACTOR
router.post("/store-actor", ActorController.storeActor);
router.post("/update-actor", ActorController.updateActor);
router.get("/list-actor/:feature_id", ActorController.listActor);
router.get("/get-actor-by/:id", ActorController.getActor);
router.get("/delete-actor/:id", ActorController.deleteActor);
router.get("/list-actor-category", ActorController.allActorCategory);

//SONGS
router.post("/store-song", SongController.storeSong);
router.post("/update-song", SongController.updateSong);
router.get("/list-song/:feature_id", SongController.listSong);
router.get("/get-song-by/:id", SongController.getSong);
router.get("/delete-song/:id", SongController.deleteSong);

//AUDIOGRAPHER
router.post("/store-audiographer", AudiographerController.storeAudiographer);
router.post("/update-audiographer", AudiographerController.updateAudiographer);
router.get(
  "/list-audiographer/:feature_id",
  AudiographerController.listAudiographer
);
router.get("/get-audiographer-by/:id", AudiographerController.getAudiographer);
router.get(
  "/delete-audiographer/:id",
  AudiographerController.deleteAudiographer
);

//*****************************BOOKS******************************//
router.post("/store-book", BookController.storeBook);
router.post("/update-book", BookController.updateBook);
router.post("/list-book", BookController.listBook);
router.get("/get-book-by/:id", BookController.getBook);
router.get("/delete-book/:id", BookController.deleteBook);

// ****************************EDITORS****************************//
router.post("/store-editor", EditorController.storeEditor);
router.post("/update-editor", EditorController.updateEditor);
router.post("/list-editor", EditorController.listEditor);
router.get("/get-editor-by/:id", EditorController.getEditor);
router.get("/delete-editor/:id", EditorController.deleteEditor);

//*****************************LANGUAGE***************************//
// router.get("/get-all-languages", CommonController.deleteEditor);

//*****************************PAYMENT*****************************//
router.post("/generate-hash", PaymentController.generateHash);

module.exports = router;
