const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/jwt.middleware");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/signup",
  validate([
    body("firstName").isLength({ min: 2 }),
    body("lastName").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.post(
  "/login",
  validate([body("email").isEmail(), body("password").isLength({ min: 6 })]),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (passwordCorrect) {
          const payload = {
            user,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: "HS256",
            expiresIn: "6h",
          });
          res.status(200).json({
            user,
            token,
          });
        } else {
          res.status(401).json({ message: "Email or password are incorrect" });
        }
      } else {
        res.status(401).json({ message: "Email or password are incorrect" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

router.get('/verify', authenticate, (req, res) => {
  res.status(200).json({
    user: req.jwtPayload.user,
  });
});

module.exports = router;
