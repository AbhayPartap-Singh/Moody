const express = require("express")
const { uploadSong, getSong } = require("../controllers/song.controllers")
const upload = require("../middleware/upload.middleware")

const songRouter = express.Router()

songRouter.post("/", upload.single("song"), uploadSong)

songRouter.get("/",getSong)
module.exports = songRouter