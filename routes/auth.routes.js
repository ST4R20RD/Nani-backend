const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/jwt.middleware");
const { body } = require("express-validator");

/* const passport = require("passport"); */

const router = express.Router();

router.post(
  "/signup",
  validate([
    body("username").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ]),
  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
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
          res.status(200).json({ user, token });
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

// The client makes a API request to this url sending the data in the body
router.post("/google/info", async (req, res) => {
  const { firstName, lastName, email, image, googleId } = req.body;
  try {
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      const payload = {
        user,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({ user, token });
    } else {
      // Create the user in the DB
      User.create({ firstName, lastName, googleId, image, email }).then(
        (response) => {
          // Save the loggedInInfo in the session
          res.status(200).json({ data: response });
        }
      );
    }
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

/* // facebook routes
router.get(
  "/facebook",
  passport.authenticate("sign-in-facebook", {
    scope: ["email"],
  })
);

// route to sign up in facebook
router.get(
  "/facebook/callback",
  passport.authenticate("sign-in-facebook", { session: true }),
  function (req, res) {
    try {
      if (req.user) {
        const payload = {
          user: req.user,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ user: req.user, token });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }
);

// route to sign in in facebook
router.get(
  "/facebook/signin",
  passport.authenticate("sign-up-facebook", { session: true }),
  function (req, res) {
    try {
      if (req.user) {
        const payload = {
          user: req.user,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.status(200).json({ user: req.user, token });
      }
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }    
  }
); */

router.get("/verify", authenticate, (req, res) => {
  res.status(200).json({
    user: req.jwtPayload.user,
  });
});

router.get("/profile", authenticate, async (req, res) => {
  const user = await User.findById(req.jwtPayload.user._id);
  res.status(200).json(user);
});

module.exports = router;
