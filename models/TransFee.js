const mongoose = require("mongoose");

const TransFeeSchema = new mongoose.Schema(
  {
    trans_fee1: { type: Number, default: 0 },
    trans_fee2: { type: Number, default: 0 },
    trans_fee3: { type: Number, default: 0 },
    trans_fee4: { type: Number, default: 0 },
    trans_fee5: { type: Number, default: 0 },
    trans_fee6: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransFee", TransFeeSchema);
