const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    Price_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Addprice",
      required: true,
    },
    trans_id: {
      type: mongoose.Schema.ObjectId,
      ref: "TransFee",
      required: true,
    },
    subqu_id: {
      type: mongoose.Schema.ObjectId,
      ref: "SubQuantity",
      required: true,
    },
    phone: String,
    gender: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
