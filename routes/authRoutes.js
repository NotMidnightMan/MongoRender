const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.post(
  "/register",
  (req, res, next) => {
    console.log("Register route hit");
    next(); // Pass control to AuthController.register
  },
  AuthController.register
);

router.post(
  "/login",
  (req, res, next) => {
    console.log("Login route hit");
    next(); // Pass control to AuthController.login
  },
  AuthController.login
);

module.exports = router;
