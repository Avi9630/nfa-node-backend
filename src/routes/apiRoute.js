const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/get-user-type", clientController.getUserType);
router.post("/register", clientController.register);

// const readController = require("../controllers/readController");
// const nfaFeatureController = require("../controllers/nfaFeatureController");
// const nfaNonFeatureController = require("../controllers/nfaNonFeatureController");
// const bestBookCinemaController = require("../controllers/bestBookCinemaController");
// const bestFilmCriticController = require("../controllers/bestFilmCriticController");
// const producerController = require("../controllers/producerController");
// const directorController = require("../controllers/directorController");
// const actorController = require("../controllers/actorController");
// const songController = require("../controllers/songController");
// const audiographerController = require("../controllers/audiographerController");
// const bookController = require("../controllers/bookController");
// const editorController = require("../controllers/editorController");
// const paymentController = require("../controllers/paymentController");

// router.get("/send-activate-link", clientController.sendActivateLink);

//
// router.post("/login", clientController.login);

// Account Activation & Password
// router.post("/verify/:token", clientController.activateAccount);
// router.get("/verify/:token", clientController.activateAccount);
// router.post("/verify-email", clientController.verifyEmail);
// router.post("/reset-password", clientController.resetPassword);
// router.post("/verify-otp", clientController.verifyOtp);
// router.post("/change-password", clientController.changePassword);

// ✅ Middleware for Authenticated Routes
// const authMiddleware = require("../middlewares/authMiddleware");
// router.use(authMiddleware);

// 📂 Client Routes
// router.post("/get-client-details", clientController.getClientDetails);
// router.get("/delete-entry/:id", clientController.entryDelete);
// router.get("/entry-list", clientController.entryList);
// router.post("/logout", clientController.logout);

// 📂 Feature Entry Routes
// router.post("/feature-entry", nfaFeatureController.entry);
// router.post("/feature-final-submit", nfaFeatureController.submit);
// router.get("/feature-entry-by/:id", nfaFeatureController.featureById);

// 📂 Non-Feature Entry Routes
// router.post("/non-feature-entry", nfaNonFeatureController.entry);
// router.post("/non-feature-final-submit", nfaNonFeatureController.submit);
// router.get("/non-feature-entry-by/:id", nfaNonFeatureController.nonFeatureById);

// 📂 Best Book Cinema Routes
// router.post("/best-book-cinema-entry", bestBookCinemaController.entry);
// router.post("/best-book-cinema-final-submit", bestBookCinemaController.submit);
// router.get(
//   "/best-book-cinema-entry-by/:id",
//   bestBookCinemaController.bestBookById
// );

// 📂 Best Film Critic Routes
// router.post("/best-film-critic-entry", bestFilmCriticController.entry);
// router.post("/best-film-critic-final-submit", bestFilmCriticController.submit);
// router.get(
//   "/best-film-critic-entry-by/:id",
//   bestFilmCriticController.bestFilmCriticById
// );

// 📂 Producer Routes
// router.post("/store-producer", producerController.storeProducer);
// router.post("/update-producer", producerController.updateProducer);
// router.post("/list-producer", producerController.listProducer);
// router.get("/get-producer-by/:id", producerController.getProducer);
// router.get("/delete-producer/:id", producerController.deleteProducer);

// 📂 Director Routes
// router.post("/store-director", directorController.storeDirector);
// router.post("/update-director", directorController.updateDirector);
// router.post("/list-director", directorController.listDirector);
// router.get("/get-director-by/:id", directorController.getDirector);
// router.get("/delete-director/:id", directorController.deleteDirector);

// 📂 Actor Routes
// router.post("/store-actor", actorController.storeActor);
// router.post("/update-actor", actorController.updateActor);
// router.get("/list-actor", actorController.listActor);
// router.get("/list-actor-category", actorController.allActorCategory);
// router.get("/get-actor-by/:id", actorController.getActor);
// router.get("/delete-actor/:id", actorController.deleteActor);

// 📂 Song Routes
// router.post("/store-song", songController.storeSong);
// router.post("/update-song", songController.updateSong);
// router.get("/list-song", songController.listSong);
// router.get("/get-song-by/:id", songController.getSong);
// router.get("/delete-song/:id", songController.deleteSong);

// 📂 Audiographer Routes
// router.post("/store-audiographer", audiographerController.storeAudiographer);
// router.post("/update-audiographer", audiographerController.updateAudiographer);
// router.get("/list-audiographer", audiographerController.listAudiographer);
// router.get("/get-audiographer-by/:id", audiographerController.getAudiographer);
// router.get(
//   "/delete-audiographer/:id",
//   audiographerController.deleteAudiographer
// );

// 📂 Book Routes
// router.post("/store-book", bookController.storeBook);
// router.post("/update-book", bookController.updateBook);
// router.post("/list-book", bookController.listBook);
// router.get("/get-book-by/:id", bookController.getBook);
// router.get("/delete-book/:id", bookController.deleteBook);

// 📂 Editor Routes
// router.post("/store-editor", editorController.storeEditor);
// router.post("/update-editor", editorController.updateEditor);
// router.post("/list-editor", editorController.listEditor);
// router.get("/get-editor-by/:id", editorController.getEditor);
// router.get("/delete-editor/:id", editorController.deleteEditor);

// 📂 Payment Routes
// router.post("/generate-hash", paymentController.generateHash);

module.exports = router;
