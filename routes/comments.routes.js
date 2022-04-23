const express = require("express");
const axios = require("axios");
const Comment = require("../models/Comment.model");
const { authenticate } = require("../middlewares/jwt.middleware");
const { uuid } = require("uuidv4");

const router = express.Router();

router.post("/:animeId", authenticate, async (req, res) => {
  try {
    const { animeId } = req.params;
    const { content } = req.body;
    const { parentId } = req.body;
    const comment = await Comment.create({
      id : uuid(),
      animeId,
      content,
      parentId,
      author: req.jwtPayload.user._id,
    });
    res.status(200).json(comment);
  } catch (error) {
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
      comment.content = content + " (edited)";
      comment = await comment.save();
      res.status(200).json(comment);
    }
  } catch (error) {
    res.status(400).json("unauthorized");
  }
});

module.exports = router;
