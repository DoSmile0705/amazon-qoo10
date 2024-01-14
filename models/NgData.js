const mongoose = require("mongoose");

const NgDataSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    ngword: Array,
    excludeword: Array,
    ngcategory: Array,
    ngasin: Array,
    ngbrand: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("NgData", NgDataSchema);
