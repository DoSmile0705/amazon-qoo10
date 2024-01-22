const mongoose = require("mongoose");

const TransFeeSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    transfee_1: { type: Number, default: 0 },
    transfee_2: { type: Number, default: 0 },
    transfee_3: { type: Number, default: 0 },
    transfee_4: { type: Number, default: 0 },
    transfee_5: { type: Number, default: 0 },
    transfee_6: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TransFee", TransFeeSchema);
