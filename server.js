const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const registers = require("./register");
const login = require("./login");
const auth = require("./auth");

// Execute database connection
dbConnect();

// Configure CORS
app.use(cors());

// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register and Login routes
app.use(registers);
app.use(login);

// Free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// Authentication endpoint (protected)
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

// Default route
app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

const PORT = 4002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
