const Song = require("../model/song.model");

// Upload song
const uploadSong = async (req, res) => {
  try {
    const { title, mood } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Song file is required" });
    }

    const songUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newSong = await Song.create({
      title,
      mood: mood.toLowerCase(),
      url: songUrl,
    });

    res.status(201).json(newSong);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Song upload failed" });
  }
};

// Get songs by mood
const getSongsByMood = async (req, res) => {
  try {
    const { mood } = req.query;

    console.log("Requested mood:", mood);

    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    const songs = await Song.find({
      mood: mood.toLowerCase(),
    }).limit(5);

    res.status(200).json(songs);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Error fetching songs" });
  }
};

module.exports = { uploadSong, getSongsByMood };