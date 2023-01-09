const jwt = require("jsonwebtoken");

// verify that the token is valid
const isAuth = (req, res, next) => {
  // bear token attached to the request header and split it
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined")
    return res.status(403).json({ message: "Invalid token" });
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, process.env.TOKEN_SECRET, (err, authData) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
    } else {
      req.user = authData;
      next();
    }
  });
};

module.exports = isAuth;
