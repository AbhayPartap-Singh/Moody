const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },

  posterUrl: {
    type: String,
    default: null
  },

  title: {
    type: String,
    required: true
  },

  mood: {
    type: String,
    enum: ["Happy", "Sad", "Angry", "Surprised"],
    required: true
  }

}, { timestamps: true })

const songModel = mongoose.model("songs", songSchema)

module.exports = songModel