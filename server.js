const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();
/* const passport = require("passport"); */

mongoose.connect(process.env.MONGO_DB_URL);

const app = express();

/* require('./passport/facebook-auth'); */

app.use(cors());

app.use(express.json());

/* app.use(passport.initialize()); */

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const animeRoutes = require("./routes/anime.routes");
app.use("/anime", animeRoutes);

const friendRoutes = require("./routes/friend.routes");
app.use("/friend", friendRoutes);

const commentsRoutes = require("./routes/comments.routes");
app.use("/comments", commentsRoutes);

app.listen(process.env.PORT);
