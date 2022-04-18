const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL);

const app = express();

app.use(cors());

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const animeRoutes = require("./routes/anime.routes");
app.use("/anime", animeRoutes);

const friendRoutes = require("./routes/friend.routes");
app.use("/friend", friendRoutes);

app.listen(process.env.PORT);
