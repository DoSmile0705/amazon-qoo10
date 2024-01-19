const mongoose = require("mongoose");

const SubQuantitySchema = new mongoose.Schema(
  {
    subquantity: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubQuantity", SubQuantitySchema);
