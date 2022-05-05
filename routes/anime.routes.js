const express = require("express");
const axios = require("axios");
const User = require("../models/User.model");
const { authenticate } = require("../middlewares/jwt.middleware");

const router = express.Router();

async function getTrendingAnime() {
  const url = "https://kitsu.io/api/edge/trending/anime";
  const response = await axios.get(url);
  return response.data.data;
}

async function getAnimeData(id) {
  const url = `https://kitsu.io/api/edge/anime/${id}`;
  const response = await axios.get(url);
  return response.data.data;
}

function searchAnime(searchString) {
  if (searchString != undefined) {
    let str = searchString.replace(" ", "%20");
    const url = `https://kitsu.io/api/edge/anime?filter[text]=${str}`;
    return axios
      .get(url)
      .then(function (response) {
        return response.data.data;
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  }
}

function getAnimePage(pageNumber) {
  const pageLimit = 20;
  const url = `https://kitsu.io/api/edge/anime?page[limit]=${pageLimit}&page[offset]=${
    pageLimit * (pageNumber - 1)
  }`;
  return axios
    .get(url)
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
}

function getPopularAnime() {
  const url = "https://kitsu.io/api/edge/anime?sort=popularityRank";
  return axios
    .get(url)
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
}

function isAnimeEqualTo(object1, object2) {
  for (let i = 0; i < object1.length; i++) {
    if (object1[i].id === object2.id) {
      return true;
    }
  }
}

router.get("/trending", async (req, res) => {
  try {
      const trend = await getTrendingAnime();
    res.status(200).json(trend);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/popular", async (req, res) => {
  try {
      const popular = await getPopularAnime();
    res.status(200).json(popular);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await getAnimeData(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/search/:searchBarInput", async (req, res) => {
  try {
    const { searchBarInput } = req.params;
    const search = await searchAnime(searchBarInput);
    res.status(200).json(search);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/listAnime/page/:pageNumber", async (req, res) => {
  try {
    const pageNr = req.params.pageNumber;
    const items = await getAnimePage(pageNr);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/addList/:id/:listOption", authenticate, async (req, res) => {
  try {
    const listOp = req.params.listOption;
    const user = await User.findById(req.jwtPayload.user._id);
    const animeId = req.params.id;
    const anime = await getAnimeData(animeId);
    const isInList = isAnimeEqualTo(user[listOp], anime);

    if (isAnimeEqualTo(user.watched, anime)) {
      user.watched.map((item, index) => {
        if (item.id === anime.id) {
          user.watched.splice(index, 1);
        }
      });
    }
    if (isAnimeEqualTo(user.watching, anime)) {
      user.watching.map((item, index) => {
        if (item.id === anime.id) {
          user.watching.splice(index, 1);
        }
      });
    }
    if (isAnimeEqualTo(user.planToWatch, anime)) {
      user.planToWatch.map((item, index) => {
        if (item.id === anime.id) {
          user.planToWatch.splice(index, 1);
        }
      });
    }
    if (listOp === "watched") {
      user.watched.push(anime);
    } else if (listOp === "watching") {
      user.watching.push(anime);
    } else if (listOp === "planToWatch") {
      user.planToWatch.push(anime);
    }

    await user.save();
    res.status(200).json(isInList || false);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/deleteList/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.jwtPayload.user._id);
    const animeId = req.params.id;
    const anime = await getAnimeData(animeId);
    if (isAnimeEqualTo(user.watched, anime)) {
      user.watched.map((anime, index) => {
        if (anime.id === animeId) {
          user.watched.splice(index, 1);
        }
      });
    }
    if (isAnimeEqualTo(user.watching, anime)) {
      user.watching.map((anime, index) => {
        if (anime.id === animeId) {
          user.watching.splice(index, 1);
        }
      });
    }
    if (isAnimeEqualTo(user.planToWatch, anime)) {
      user.planToWatch.map((anime, index) => {
        if (anime.id === animeId) {
          user.planToWatch.splice(index, 1);
        }
      });
    }
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
