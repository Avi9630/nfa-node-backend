const mySqlPool = require("./src/config/database");
// const apiRoutes = require("./src/routes/apiRoute");
const routes = require("./src/routes/route");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
mySqlPool
  .query("SELECT 1")
  .then(() => {
    //MYSQL
    console.log("Connected to the MySQL server");
    //Listen
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the MySQL server", err);
  });
