const responseHelper = require("./src/helpers/responseHelper");
const mySqlPool = require("./src/config/database");
const apiRoutes = require("./src/routes/apiRoute");
const authRoute = require("./src/routes/authRoute");
const Auth = require("./src/middleware/auth");
const routes = require("./src/routes/route");
const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
var cors = require("cors");
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const upload = multer();

// app.post("/submit", upload.any(), (req, res) => {
//   payload = req.body;
//   responseHelper(res, "success", { data: payload, file: req.file });
// });

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
