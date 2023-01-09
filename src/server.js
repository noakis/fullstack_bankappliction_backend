const express = require("express");
const mongoose = require("mongoose");
const api = require("./routes/index.js");
const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
require("./utils/strategies/google");

// import passport and passport-jwt modules
const passport = require("passport");
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", api);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
