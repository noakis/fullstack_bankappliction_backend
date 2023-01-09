const auth = require("./auth");
const accounts = require("./accounts");
const transactions = require("./transactions");
const router = require("express").Router();

router.use("/auth", auth);
router.use("/accounts", accounts);
router.use("/transactions", transactions);

module.exports = router;
