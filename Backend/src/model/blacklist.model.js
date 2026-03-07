const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "it is required"]
    }
  },
  {
    timestamps: true
  }
);

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = blacklistModel;