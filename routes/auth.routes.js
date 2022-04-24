const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const validate = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/jwt.middleware");
const { body } = require("express-validator");
const fileUploader = require("../config/cloudinary.config");
const axios = require("axios");

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
    const { username, email, password, confirmPassword } = req.body;
    try {
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      } else {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
          username,
          email,
          password: passwordHash,
        });
        res.status(200).json(user);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.post(
  "/login",
  validate([body("email").isEmail(), body("password").isLength({ min: 6 })]),
  async (req, res) => {
    const { email, password, captchaToken } = req.body;
    try {
      // Calls the API from Google to verify the Captcha response
      const respond = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${captchaToken}`
      );
      // If the Captcha is valid (it's not a bot and it was checked)
      if (respond.data.success) {
        const user = await User.findOne({ email });
        if (user) {
          const passwordCorrect = await bcrypt.compare(password, user.password);
          if (passwordCorrect) {
            const payload = {
              user: {
                _id: user._id,
                username: user.username,
                email: user.email,
              },
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
              algorithm: "HS256",
              expiresIn: "6h",
            });
            res.status(200).json({ user, token });
          } else {
            res
              .status(401)
              .json({ message: "Email or password are incorrect" });
          }
        } else {
          res.status(401).json({ message: "Email or password are incorrect" });
        }
      } else {
        res.status(401).json({ message: "Captcha failed" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// The client makes a API request to this url sending the data in the body
router.post("/google/info", async (req, res) => {
  const { username, firstName, lastName, email, image, googleId } = req.body;
  try {
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      const payload = {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({ user, token });
    } else {
      // Create the user in the DB
      const user = await User.create({
        username,
        firstName,
        lastName,
        googleId,
        image,
        email,
      });
      const payload = {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      res.status(200).json({ user, token });
    }
  } catch (error) {
    res.status(500).json({ error: `${error}` });
  }
});

/* // The client makes a API request to this url sending the data in the body
router.post("/facebook/info", (req, res, next) => {
  const {name, email, image, facebookId} = req.body
  // the name itself will include the last name
  try {
    // Create the user in the DB
    User.create({firstName: name, facebookId, image, email})
      .then((response) => {
        res.status(200).json({data: response})
      })
  }
  catch(error) {
    res.status(500).json({error: `${error}`})
  }
}); */

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
  try {
    const user = await User.findById(req.jwtPayload.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, userId, image } = req.body;
    let user = await User.findById(req.jwtPayload.user._id);
    if (userId === req.jwtPayload.user._id) {
      user.username = username;
      if (!image) {
        user.image;
      } else {
        user.image = image;
      }
      user = await user.save();
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "You are not authorized" });
  }
});

router.post(
  "/upload",
  authenticate,
  fileUploader.single("image"),
  (req, res) => {
    res.json(req.file);
  }
);

module.exports = router;
