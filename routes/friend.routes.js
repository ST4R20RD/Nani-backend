const express = require("express");
const { authenticate } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.jwtPayload.user._id).populate("following").populate("followers");
      const following = user.following;
      const followers = user.followers;
      res.status(200).json({following,followers});
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  router.get(
    "/search/:searchBarInput",
    authenticate,
    async (req, res) => {
      try {
        const { searchBarInput } = req.params;
        const result = await User.find({ username: `${searchBarInput}` });
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json(error);
      }
    }
  );
  
  function isUserEqualTo(object1, object2) {
    if (object1.length === 0) return false;
    for (let i = 0; i <= object1.length; i++) {
      if (object1[i]._id.equals(object2._id)) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  router.get("/:id/add", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.jwtPayload.user._id);
      const friend = await User.findById(req.params.id);
      if (!isUserEqualTo(user.following, friend)) {
        user.following.push(friend._id);
        friend.followers.push(user._id);
      }
      user.save();
      friend.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  router.get("/friendProfile/:id", authenticate, async (req, res) => {
    try {
      const friend = await User.findById(req.params.id);
      res.status(200).json(friend);
    } catch (error) {
      res.status(500).json(error);
    }
  });

module.exports = router;