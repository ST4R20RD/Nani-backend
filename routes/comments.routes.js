const express = require("express");
const axios = require("axios");
const Comment = require("../models/Comment.model");
const { authenticate } = require("../middlewares/jwt.middleware");

const router = express.Router();

router.post("/:animeId", authenticate, async (req, res) => {
  try {
    const { animeId } = req.params;
    const { content } = req.body;
    const { id } = req.body;
    console.log(content)
    const comment = await Comment.create({
      id,
      animeId,
      content,
      author: req.jwtPayload.user._id,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.get("/:animeId", async (req, res) => {
  try {
    const { animeId } = req.params;
    const comments = await Comment.find({ animeId }).populate("author");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json(error);
  }
});

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
