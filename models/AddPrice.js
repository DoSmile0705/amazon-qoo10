const mongoose = require("mongoose");

const AddPriceSchema = new mongoose.Schema(
  {
    bene_rate: { type: Number, default: 0 },
    odds_amount: { type: Number, default: 0 },
    qoo10_quantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Addprice", AddPriceSchema);
