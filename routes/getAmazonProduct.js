const express = require("express");
const router = express.Router();
const {
  addProductToMydb,
  getAllProductOfMydb,
  updateProductOfMydb,
  exhibitProducts,
} = require("../controller/getAmazonProductController");

router.post("/add", addProductToMydb);
router.get("/", getAllProductOfMydb);
router.post("/", updateProductOfMydb);
router.post("/exhibit", exhibitProducts);

module.exports = router;
