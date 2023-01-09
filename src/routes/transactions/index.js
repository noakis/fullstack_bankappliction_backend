const express = require("express");
const {
  newTransaction,
  getUserTransactions,
  getAccountTransactions,
} = require("../../controllers/transactions");
const router = express.Router();
const auth = require("../../middlewares/auth");

// Path: src/routes/transactions/index.js
router.post("/new", auth, newTransaction);
router.get("/me", auth, getUserTransactions);
router.get("/account/:id", auth, getAccountTransactions);

module.exports = router;
