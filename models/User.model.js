const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    /* required: true, */
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    /* required: true, */
  },
  image: String,
  googleId: String,
  facebookId: String,
  watched: [],
  watching: [],
  planToWatch: [],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
});

const User = model("User", userSchema);

module.exports = User;
