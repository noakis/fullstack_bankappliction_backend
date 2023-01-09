// transaction model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Account = require("./Account");

const TransactionType = ["deposit", "withdrawal", "sent", "received"];

const transactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: TransactionType },
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number },
  },
  {
    timestamps: true,
  }
);

// method to update account balance when a transaction is made
transactionSchema.pre("save", async function (next) {
  const transaction = this;
  // get account
  const account = await Account.findById(transaction.account);
  if (!account) return next();
  // update account balance
  if (transaction.type === "deposit") {
    account.balance += transaction.amount;
  } else if (transaction.type === "withdrawal") {
    account.balance -= transaction.amount;
  } else if (transaction.type === "sent") {
    account.balance -= transaction.amount;
  } else if (transaction.type === "received") {
    account.balance += transaction.amount;
  }
  transaction.balance = account.balance;
  // save account
  await account.save();
  next();
});

// method to generate a receive transaction when a send transaction is made
transactionSchema.pre("save", async function (next) {
  const transaction = this;
  if (transaction.type !== "sent") return next();
  // get recipient account
  const recipient = await Account.findById(transaction.recipientAccount);
  if (!recipient) return next();
  // create a new transaction
  const newTransaction = new Transaction({
    amount: transaction.amount,
    type: "received",
    account: recipient._id,
    owner: recipient.owner,
  });
  await newTransaction.save();
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
