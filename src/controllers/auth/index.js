// controllers for authentication
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport");

// ----------login-----------//
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // create and assign a token
    const tokens = await user.generateAuthTokens();
    res.status(200).json({ ...tokens });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------register-----------//
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });
    const _newUser = await newUser.save();
    // create and assign tokens
    const newSavedUser = await User.findOne({ email: email });
    const tokens = await newSavedUser.generateAuthTokens();
    res.status(201).json({ ...tokens });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------get profile-----------//
const getProfile = async (req, res) => {
  try {
    // transform the user id to ObjectId

    req.user._id = req.user._id.toString();
    console.log(req.user._id);
    const user = await User.findById(req.user._id);
    console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------refresh token-----------//
const refreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Access denied" });
  try {
    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { _id: verified._id },
      process.env.TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { _id: verified._id },
      process.env.REFRESH_TOKEN_SECRET
    );
    const tokens = { accessToken, refreshToken };
    res.status(200).json({ tokens });
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// ----------edit profile-----------//
const editProfile = async (req, res) => {
  try {
    const editedUser = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true }
    );
    if (!editedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ editedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----------login with google-----------//
const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// ----------google middleware-----------//
const googleMiddleware = passport.authenticate("google", {
  failureRedirect: "/",
});

// ----------google callback-----------//
const googleCallback = async (req, res) => {
  try {
    const { tokens } = req.user;
    // redirect to frontend
    res.redirect(
      `http://localhost:3002/auth?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};
// ----------login with facebook-----------//

module.exports = {
  login,
  register,
  refreshToken,
  getProfile,
  googleLogin,
  googleMiddleware,
  googleCallback,
  editProfile,
};
