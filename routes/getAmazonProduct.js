const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  addProductToMydb,
  getAllProductOfMydb,
  updateProductOfMydb,
  exhibitProducts,
  asinfileUpload,
} = require("../controller/getAmazonProductController");

router.post("/add", addProductToMydb);
router.get("/", getAllProductOfMydb);
router.post("/", updateProductOfMydb);
router.post("/exhibit", exhibitProducts);
router.post("/upload", upload.single("file"), asinfileUpload);
module.exports = router;
