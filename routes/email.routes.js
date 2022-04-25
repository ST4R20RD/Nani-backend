const express = require("express");
const emailController = require("../email/email.controller");

const router = express.Router();

router.post("/", emailController.collectEmail);

router.get("/confirm/:id", emailController.confirmEmail);

router.post("/reset", emailController.resetPassword);

router.post("/:id/:token", emailController.resetPasswordToken);

module.exports = router;
