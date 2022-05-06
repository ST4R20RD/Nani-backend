const express = require("express");
const emailController = require("../email/email.controller");

// Express router
const router = express.Router();

// Route to send the confirmation email
router.post("/", emailController.collectEmail);

// Route to get the confirmation email
router.get("/confirm/:id", emailController.confirmEmail);

// Route to get the reset the password form
router.post("/reset", emailController.resetPassword);

// Route to reset the password when you have the token from the email
router.post("/:id/:token", emailController.resetPasswordToken);

module.exports = router;
