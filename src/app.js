const express = require("express");

const app = express();
const cors = require("cors");
const logger = require("morgan");
const dbConnect = require("./config/database");
const apiRoutes = require("./routes/index");

// set dotenv
require("dotenv").config();

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000;

// Middleware Array
const middleware = [
  logger("dev"),
  cors(),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
];

app.use(middleware);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Samurai Train Service!");
});

// Api routes
app.use("/api", apiRoutes);

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Add 'next' as the fourth parameter
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Connect to the database
dbConnect();

app.listen(port, () => {
  console.log(`Book store app listening on port ${port}!`);
  console.log(`Running on port: ${port}`);
});
