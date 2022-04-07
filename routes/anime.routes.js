const express = require("express");
const axios = require("axios")

const router = express.Router();

async function getTrendingAnime() {
    const url = "https://kitsu.io/api/edge/trending/anime"
    
    const response = await axios.get(url)
    console.log(response)
  }

router.get("/home", async (req, res) => {
    /* const trend = await getTrendingAnime() */
res.send("hello")
})

module.exports = router