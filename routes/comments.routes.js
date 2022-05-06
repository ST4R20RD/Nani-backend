const express = require("express");
const axios = require("axios");
const Comment = require("../models/Comment.model");
const { authenticate } = require("../middlewares/jwt.middleware");
const { v4: uuidv4 } = require('uuid');

// Express router
const router = express.Router();

// Route to post a comment to an anime
router.post("/:animeId", authenticate, async (req, res) => {
  try {
    const { animeId } = req.params;
    const { content } = req.body;
    const { parentId } = req.body;
    const comment = await Comment.create({
      id : uuidv4(),
      animeId,
      content,
      parentId,
      author: req.jwtPayload.user._id,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Route to get the comments in an anime
router.get("/:animeId", async (req, res) => {
  try {
    const { animeId } = req.params;
    const comments = await Comment.find({ animeId }).populate("author");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Route to delete the comments in an anime
router.delete("/:commentId", authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findOne({id: commentId});
    if (comment.author.toString() === req.jwtPayload.user._id) {
      await Comment.findOneAndRemove({id: commentId});
      res.status(200).json(comment);
    }
  } catch (error) {
    res.status(400).json("unauthorized");
  }
});

// Route to update the comments in an anime
router.put("/:commentId", authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    let comment = await Comment.findOne({id: commentId});
    if (comment.author.toString() === req.jwtPayload.user._id) {
      comment.content = content;
      comment = await comment.save();
      res.status(200).json(comment);
    }
  } catch (error) {
    res.status(400).json("unauthorized");
  }
});

module.exports = router;
