const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
dotenv.config();

// Connects to mongoose
mongoose.connect(process.env.MONGO_DB_URL);

const app = express();

/* require('./passport/facebook-auth'); */

// Code for LOCALHOST
/* app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
); */

// Code for NETLIFY and HEROKU
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.use(express.json());

// Routes for authentication
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Routes for anime
const animeRoutes = require("./routes/anime.routes");
app.use("/anime", animeRoutes);

// Routes for friends
const friendRoutes = require("./routes/friend.routes");
app.use("/friend", friendRoutes);

// Routes for comments
const commentsRoutes = require("./routes/comments.routes");
app.use("/comments", commentsRoutes);

// Routes for emails
const emailRoutes = require("./routes/email.routes");
app.use("/email", emailRoutes);

// Code for LOCALHOST
/* app.listen(process.env.PORT);

const io = new Server({
  cors: {
    origin: `http://localhost:3000`,
  },
}); */

// Code for NETLIFY and HEROKU
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

let onlineUsers = [];
// Socket.io for adding a new user
const addNewUser = (userID, socketId) => {
  !onlineUsers.some((user) => {
    user.userID === userID;
  }) && onlineUsers.push({ userID, socketId });
};
// Socket.io for removing a user
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
// Socket.io for gegtinf a user
const getUser = (userID) => {
  return onlineUsers.find((user) => user.userID === userID);
};
// Connects to socket.io
io.on("connection", (socket) => {
  socket.on("newUser", (userID) => {
    addNewUser(userID, socket.id);
  });
  // Sends a notification using socket.io
  socket.on("sendNotification", ({ senderUsername, receiverId, type, url }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getNotification", {
      notification: `${senderUsername} ${type}`,
      url,
    });
  });
  // Disconnect from socket.io
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// Code for LOCALHOST
/* io.listen(process.env.SOCKETPORT); */

// Code for NETLIFY and HEROKU
server.listen(process.env.PORT || 5000);
