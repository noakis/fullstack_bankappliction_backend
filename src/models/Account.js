// schema for bank accounts
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// limit account type to only 3 types
const accountType = ["savings", "checking", "credit"];

const accountSchema = new Schema(
  {
    type: { type: String, required: true, enum: accountType },
    balance: { type: Number, default: 0 },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    nickname: { type: String },
    accountNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

// method to generate account number
accountSchema.pre("save", async function (next) {
  const account = this;
  if (!account.isModified("accountNumber")) return next();
  await bcrypt.hash(account.accountNumber, 10, (err, hash) => {
    if (err) return next(err);
    account.accountNumber = hash;
    console.log(account.accountNumber);
    next();
  });
});

const Account = mongoose.model("BankAccount", accountSchema);

module.exports = Account;
