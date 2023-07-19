const express = require("express");
const User = require("./db/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = express();

login.post("/login", (request, response) => {
  // check if email exists
  User.findOne({ email: request.body.email })
    .then((user) => {
      // if email doesn't exist
      if (!user) {
        return response.status(404).json({
          message: "Email not found",
        });
      }

      // compare the entered password with the hashed password
      bcrypt
        .compare(request.body.password, user.password)
        .then((passwordCheck) => {
          // if the passwords don't match
          if (!passwordCheck) {
            return response.status(400).json({
              message: "Passwords do not match",
            });
          }

          // generate JWT token
          const token = jwt.sign({ email: user.email }, 'your-secret-key', { expiresIn: '1h' });

          // return success response with token
          response.status(200).json({
            status: 'ok',
            data: token,
          });
        })
        .catch((error) => {
          response.status(500).json({
            message: "An error occurred during password comparison",
          });
        });
    })
    .catch((error) => {
      response.status(500).json({
        message: "An error occurred during email lookup",
      });
    });
});

module.exports = login;

