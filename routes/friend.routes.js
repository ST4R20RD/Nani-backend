const express = require("express");
const { authenticate } = require("../middlewares/jwt.middleware");
const User = require("../models/User.model");

const router = express.Router();

// get all people signed up
router.get("/", authenticate, async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// get specific user in the database with id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("following")
      .populate("followers");
    const following = user.following;
    const followers = user.followers;
    res.status(200).json({ following, followers });
  } catch (error) {
    res.status(500).json(error);
  }
});

// get searched user in the database with mathing query for username
router.get("/search/:searchBarInput", authenticate, async (req, res) => {
  try {
    const { searchBarInput } = req.params;
    const result = await User.find({
      username: { $regex: `${searchBarInput}`, $options: "i" },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

/**
 * If the array is empty, return false. If the array is not empty, loop through the array and check if
 * the id of the object in the array is equal to the id of the object passed in as the second argument.
 * If it is, return true. If it isn't, return false
 * @param object1 - the array of users that have liked the post
 * @param object2 - the user that is currently logged in
 * @returns A boolean value.
 */
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

/* This is the route that is called when the user clicks the follow button. It takes the user that is
logged in and the user that is being followed and adds the user that is being followed to the logged
in user's following array and adds the logged in user to the user that is being followed's followers
array. */
router.get("/:id/add", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.jwtPayload.user._id);
    const friend = await User.findById(req.params.id);
    if (user.following.indexOf(friend._id) !== -1) {
      const friendIndex = user.following.indexOf(friend._id);
      user.following.splice(friendIndex, 1);
      const userIndex = friend.followers.indexOf(user._id);
      friend.followers.splice(userIndex, 1);
    } else if (!isUserEqualTo(user.following, friend)) {
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

/* This is the route that is called when the user clicks on a friend's profile. It takes the id of the
friend and returns the friend's profile. */
router.get("/friendProfile/:id", authenticate, async (req, res) => {
  try {
    const friend = await User.findById(req.params.id);
    res.status(200).json(friend);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
