const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();

router.post("/register", (req, res) => {
  console.log("Register route hit");
  res.send("Register route is working");
});

router.post(
  "/login",
  (req, res, next) => {
    console.log("Login route hit");
    next(); // Pass control to AuthController.login
  },
  AuthController.login(req, res)
);

module.exports = router;
