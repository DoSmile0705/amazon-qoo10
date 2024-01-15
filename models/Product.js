const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    asin: String,
    userId: String,
    title: String,
    SecondSubCat: String,
    ItemCode: String,
    img: Array,
    description: String,
    price: Number,
    qoo10_price: Number,
    transport_fee: { type: Number, default: 0 },
    AdultYN: { type: Boolean, default: false },
    predictableIncome: Number,
    bullet_point: Array,
    item_weight: Array,
    item_dimensions: Array,
    brand: String,
    part_number: String,
    item_package_weight: Array,
    battery: Array,
    manufacturer: String,
    recommended_browse_nodes: Array,
    releaseDate: String,
    websiteDisplayGroup: String,
    websiteDisplayGroupName: String,
    ItemStatus: String,
    itemClassification: String,
    package: Object,
    selledQuantity: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    bene_rate: { type: Number, default: 0 },
    odds_amount: { type: Number, default: 0 },
    qoo10_quantity: { type: Number, default: 0 },
    status: { type: String, default: "新規追加" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
