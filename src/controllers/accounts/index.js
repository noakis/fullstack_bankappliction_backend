// create a new bank account
const Account = require("../../models/Account");
const openAccount = async (req, res) => {
  try {
    const { type, balance, nickname } = req.body;

    // create a new account
    const newAccount = new Account({
      owner: req.user._id,
      type,
      nickname,
    });
    const _newAccount = await newAccount.save();
    res.status(201).json({ account: _newAccount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all user accounts
const getUseerAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ owner: req.user._id });
    res.status(200).json({ accounts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// patch account
const patchAccount = async (req, res) => {
  try {
    const { type, balance } = req.body;
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (type) {
      account.type = type;
    }
    if (balance) {
      account.balance = balance;
    }
    const _account = await account.save();
    res.status(200).json({ _account });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// delete account
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await account.remove();
    res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get account details
const getAccountDetails = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (account.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json({
      account: {
        type: account.type,
        balance: account.balance,
        nickname: account.nickname,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  openAccount,
  getUseerAccounts,
  patchAccount,
  deleteAccount,
  getAccountDetails,
};
