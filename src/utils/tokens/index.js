const jwt = require("jsonwebtoken");

// check if refresh token is valid and return new access token
export const refreshToken = async (req, res) => {
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
