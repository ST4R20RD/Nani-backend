const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
dotenv.config();
/* const passport = require("passport"); */

mongoose.connect(process.env.MONGO_DB_URL);

const app = express();

/* require('./passport/facebook-auth'); */

app.use(cors());

/* app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN || 'http://localhost:3000'
    })
  ); */

app.use(express.json());

/* app.get("/", (req, res) => {
  console.log("Hello World");
}); */

/* app.use(passport.initialize()); */

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const animeRoutes = require("./routes/anime.routes");
app.use("/anime", animeRoutes);

const friendRoutes = require("./routes/friend.routes");
app.use("/friend", friendRoutes);

const commentsRoutes = require("./routes/comments.routes");
app.use("/comments", commentsRoutes);

const emailRoutes = require("./routes/email.routes");
app.use("/email", emailRoutes);

app.listen(process.env.PORT);

const io = new Server({
  cors: {
    origin: `http://localhost:3000`,
  },
});

let onlineUsers = [];

const addNewUser = (userID, socketId) => {
  !onlineUsers.some((user) => {
    user.userID === userID;
  }) && onlineUsers.push({ userID, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userID) => {
  return onlineUsers.find((user) => user.userID === userID);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userID) => {
    addNewUser(userID, socket.id);
  });

  socket.on("sendNotification", ({ senderId, receiverId, type, url }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNotification", {
      senderId,
      type,
      url,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(process.env.SOCKETPORT);
