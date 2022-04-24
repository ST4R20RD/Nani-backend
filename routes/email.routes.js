const express = require("express");
const emailController = require("../email/email.controller");

const router = express.Router();

router.post("/", emailController.collectEmail);

router.get("/confirm/:id", emailController.confirmEmail);

module.exports = router;
