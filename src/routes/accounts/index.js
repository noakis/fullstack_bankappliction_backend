const {
  openAccount,
  getUseerAccounts,
  patchAccount,
  deleteAccount,
  getAccountDetails,
} = require("../../controllers/accounts");
const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();

// open new account
router.post("/", auth, openAccount);
// get all user accounts
router.get("/", auth, getUseerAccounts);
// patch account
router.patch("/:id", auth, patchAccount);
// delete account
router.delete("/:id", auth, deleteAccount);
// get account details
router.get("/:id", auth, getAccountDetails);

module.exports = router;
