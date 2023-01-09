const Transaction = require("../../models/Transaction");
const Account = require("../../models/Account");

const newTransaction = async (req, res) => {
  try {
    const { amount, type, account } = req.body;
    console.log(req.body);
    // create a new transaction only if the account belongs to the user
    const _account = await Account.findById(account);
    if (!_account) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (_account.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    // if the transaction is a withdrawal, check if the account has enough balance
    if (
      (type === "withdrawal" && _account.balance < amount) ||
      (type === "sent" && _account.balance < amount)
    ) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    const newTransaction = new Transaction({
      amount,
      type,
      account,
      owner: req.user._id,
    });
    if (type === "sent") {
      newTransaction.recipientAccount = req.body.recipientAccount;
    }
    const _newTransaction = await newTransaction.save();
    console.log(_newTransaction);

    res.status(201).json({ transaction: _newTransaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all user transactions
const getUserTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.find({ owner: req.user._id });
    // sort transactions by date from newest to oldest
    transactions = transactions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // paginate transactions
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < transactions.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.results = transactions.slice(startIndex, endIndex);
    res.status(200).json({
      transactions: results.results || [],
      total: transactions.length,
      totalPages: Math.ceil(transactions.length / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get all account transactions
const getAccountTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.find({ account: req.params.id });
    // sort transactions by date from newest to oldest
    transactions = transactions.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // paginate transactions
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};
    if (endIndex < transactions.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    results.results = transactions.slice(startIndex, endIndex);
    res.status(200).json({
      transactions: results.results || [],
      total: transactions.length,
      totalPages: Math.ceil(transactions.length / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  newTransaction,
  getUserTransactions,
  getAccountTransactions,
};
