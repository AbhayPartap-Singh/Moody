const express = require("express");
const authcontroller = require("../controllers/auth.controllers");
const authMiddleware = require("../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", authcontroller.registerUser);
authRouter.post("/login", authcontroller.loginUser);
authRouter.post("/logout", authcontroller.logoutUser);

authRouter.get(
  "/get-me",
  authMiddleware,     // verify JWT
  authcontroller.getMe // return user data
);

module.exports = authRouter;