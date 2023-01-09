const express = require("express");
const {
  login,
  refreshToken,
  register,
  getProfile,
  googleLogin,
  googleMiddleware,
  googleCallback,
  editProfile,
} = require("../../controllers/auth");
const isAuth = require("../../middlewares/auth");
const router = express.Router();

// Path: src/routes/auth/index.js

router.post("/login", login);
router.post("/register", register);
router.get("/refresh-token", refreshToken);
router.get("/me", isAuth, getProfile);
router.put("/me", isAuth, editProfile);
router.get("/google", googleLogin);
router.get("/google/callback", googleMiddleware, googleCallback);

module.exports = router;
