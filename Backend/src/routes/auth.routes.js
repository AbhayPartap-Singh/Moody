const express = require("express");
const authcontroller = require("../controllers/auth.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = express.Router();

// Register user
authRouter.post("/register", authcontroller.registerUser);

// Login user
authRouter.post("/login", authcontroller.loginUser);

// Logout user
authRouter.post("/logout", authcontroller.logoutUser);

// Get logged-in user
authRouter.get(
  "/get-me",
  authMiddleware, // verify JWT
  authcontroller.getMe
);

module.exports = authRouter;