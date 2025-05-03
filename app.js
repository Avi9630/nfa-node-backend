const mySqlPool = require("./src/config/database");
const apiRoutes = require("./src/routes/apiRoute");
const authRoute = require("./src/routes/authRoute");
const routes = require("./src/routes/route");
const Auth = require("./src/middleware/auth");
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const multer = require("multer");
const responseHelper = require("./src/helpers/responseHelper");
// const upload = require("multer")();
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const upload = multer();

// Testing
app.post("/submit", upload.any(), (req, res) => {
    payload = req.body;
    responseHelper(res, "success", { data: payload, file: req.file });
    // res.send("Form received!" + payload);
});

// Routes
app.use("/", routes);
app.use("/api", upload.any(), apiRoutes);
app.use("/api", Auth, authRoute);

const PORT = process.env.PORT || 3000;
mySqlPool
  .query("SELECT 1")
  .then(() => {
    console.log("Connected to the MySQL server");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the MySQL server", err);
  });
