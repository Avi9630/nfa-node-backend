const responseHelper = require("./helpers/responseHelper");
const authRoute = require("./routes/authRoute");
const apiRoutes = require("./routes/apiRoute");
const Auth = require("./middleware/auth");
const sequelize = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
var cors = require("cors");
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();
app.use(cors());

app.get("/testing", (req, res) => {
  return responseHelper(res, "success");
});

// Routes
app.use("/api", upload.any(), apiRoutes);
app.use("/api", Auth, authRoute);

// DB CONNECTION
const PORT = process.env.PORT || 3000;
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Connected!");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });
