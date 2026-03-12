const songModel = require("../model/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

async function uploadSong(req, res) {

  console.log("Upload route hit")

  try {

    // 1️⃣ Check file
    if (!req.file) {
      console.log("No file received")
      return res.status(400).json({
        error: "No song file uploaded"
      })
    }

    // 2️⃣ Validate file type
    if (req.file.mimetype !== "audio/mpeg") {
      console.log("Invalid file type:", req.file.mimetype)
      return res.status(400).json({
        error: "Only MP3 files are allowed"
      })
    }

    const songBuffer = req.file.buffer
    const { mood } = req.body

    // 3️⃣ Validate mood
    if (!mood) {
      console.log("Mood missing")
      return res.status(400).json({
        error: "Mood is required"
      })
    }

    console.log("Reading metadata...")

    // 4️⃣ Read ID3 metadata safely
    let tags = {}
    try {
      tags = id3.read(songBuffer) || {}
    } catch (err) {
      console.log("ID3 parsing failed, continuing without metadata")
    }

    // 5️⃣ Determine title
    const title =
      tags.title ||
      req.file.originalname.replace(/\.[^/.]+$/, "")

    console.log("Song title:", title)

    // 6️⃣ Upload song to storage
    console.log("Uploading song to storage...")

    const songFile = await storageService.uploadFile({
      buffer: songBuffer,
      fileName: `${title}.mp3`,
      folder: "/Moody/songs"
    })

    console.log("Song uploaded:", songFile)

    let posterFile = null

    // 7️⃣ Upload album art if exists
    if (tags.image) {

      console.log("Album art detected")

      const imageData = Array.isArray(tags.image)
        ? tags.image[0].imageBuffer
        : tags.image.imageBuffer

      posterFile = await storageService.uploadFile({
        buffer: imageData,
        fileName: `${title}.jpg`,
        folder: "/Moody/posters"
      })

      console.log("Poster uploaded:", posterFile)
    }

    // 8️⃣ Save to MongoDB
    console.log("Saving song to database...")

    const song = await songModel.create({
      title,
      mood,
      url: songFile.url,
      posterUrl: posterFile ? posterFile.url : null
    })

    console.log("Saved song:", song)

    // 9️⃣ Send response
    res.status(201).json({
      message: "Song uploaded successfully",
      song
    })

  } catch (err) {

    console.error("Upload Error:", err)

    res.status(500).json({
      error: "Upload failed",
      details: err.message
    })

  }

}

async function getSong(req, res) {
    const {mood}  = req.query
    
    const song = await songModel.find({mood})

    res.status(200).json({
        message: "Song fetched successfully",
        song
    })
    
  }
module.exports = { uploadSong , getSong}