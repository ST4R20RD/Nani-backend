const User = require("../models/User.model");
const sendEmail = require("./email.send");
const msgs = require("./email.msgs");
const templates = require("./email.templates");
const Token = require("../models/Token.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const saltRounds = 12;

// The callback that is invoked when the user submits the form on the client.
exports.collectEmail = (req, res) => {
  const { email, url } = req.body;
  User.findOne({ email })
    .then((user) => {
      // We have a new user! Send them a confirmation email.
      if (!user) {
        User.create({ email })
          .then((newUser) =>
            sendEmail(newUser.email, templates.confirm(newUser._id, url))
          )
          .then(() => res.json({ msg: msgs.confirm }))
          .catch((err) => console.log(err));
      }
      // We have already seen this email address. But the user has not
      // clicked on the confirmation link. Send another confirmation email.
      else if (user && !user.confirmed) {
        sendEmail(user.email, templates.confirm(user._id, url)).then(() =>
          /* res.json({ msg: msgs.resend }) */
          res.json({ msg: msgs.confirm })
        );
      }
      // The user has already confirmed this email address
      else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((err) => console.log(err));
};

// The callback that is invoked when the user visits the confirmation
// url on the client and a fetch request is sent.
exports.confirmEmail = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      // A user with that id does not exist in the DB. Perhaps some tricky
      // user tried to go to a different url than the one provided in the
      // confirmation email.
      if (!user) {
        res.json({ msg: msgs.couldNotFind });
      }
      // The user exists but has not been confirmed. We need to confirm this
      // user and let them know their email address has been confirmed.
      else if (user && !user.confirmed) {
        User.findByIdAndUpdate(id, { confirmed: true })
          .then(() => res.json({ msg: msgs.confirmed }))
          .catch((err) => console.log(err));
      }
      // The user has already confirmed this email address.
      else {
        res.json({ msg: msgs.alreadyConfirmed });
      }
    })
    .catch((err) => console.log(err));
};

// The callback that is invoked when the user wants to reset their password.
exports.resetPassword = async (req, res) => {
  const { url } = req.body;
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send({ msg: msgs.notExist });

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    await sendEmail(user.email, templates.reset(user._id, url, token.token));
    res.json({ msg: msgs.confirm });
  } catch (error) {
    console.log(error);
  }
};

// The callback that is invoked when the user visits the reset password url
exports.resetPasswordToken = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    } else {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) return res.status(400).send({ msg: msgs.invalid });
      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send({ msg: msgs.invalid });
      const password = req.body.password;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();
      await token.delete();
      res.status(200).json({ msg: msgs.passChanged });
    }
  } catch (error) {
    console.log(error);
  }
};
