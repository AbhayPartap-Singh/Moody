const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    posterUrl: {
      type: String,
      default: null,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    mood: {
      type: String,
      enum: ["happy", "sad", "angry", "surprise"],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const songModel = mongoose.model("Song", songSchema);

module.exports = songModel;