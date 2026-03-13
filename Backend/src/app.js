const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

// Serve uploaded files
app.use("/uploads", express.static("uploads")); // ✅ Added this line

// Routes
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

module.exports = app;