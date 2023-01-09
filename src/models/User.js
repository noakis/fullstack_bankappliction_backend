// create a user model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 3 },
    lastName: { type: String, required: true, trim: true, minlength: 3 },
    googleId: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: { type: String, required: true, trim: true, minlength: 3 },
    image: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String },
    ig: { type: String },
    fb: { type: String },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

// method to crypt password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(user.password, salt);
  user.password = hash;
  next();
});

// async method to compare password
userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// sign token
userSchema.methods.generateAuthTokens = async function () {
  const user = this;
  const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );
  const tokens = { accessToken, refreshToken };
  return tokens;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
