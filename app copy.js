const sequelize = require("./src/config/database");
const apiRoutes = require("./src/routes/apiRoute");
const routes = require("./src/routes/route");
const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
// require("dotenv").config();
dotenv.config();

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test MySQL Connection on Server Start
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL successfully!");
    // await sequelize.sync(); // or { alter: true } for development
    // console.log("Database synchronized");
  } catch (error) {
    console.error("❌ Unable to connect to MySQL:", error.message);
    process.exit(1);
  }
})();

// Routes
app.use("/", routes);
// app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
