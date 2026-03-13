const express = require("express");
const {
  uploadSong,
  getSongsByMood,
} = require("../controllers/song.controllers");

const upload = require("../middleware/upload.middleware");

const songRouter = express.Router();

// upload song
songRouter.post("/", upload.single("song"), uploadSong);

// fetch songs by mood
songRouter.get("/", getSongsByMood);

module.exports = songRouter;