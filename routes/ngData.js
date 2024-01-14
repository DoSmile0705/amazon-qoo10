const express = require("express");
const router = express.Router();
const { getAllNgData, addNgData, useNgData, deleteNgData } = require("../controller/ngDataController");

// router.get("/:asin", getAmazonProduct);
router.get("/:id", getAllNgData);
router.post("/", addNgData);
router.post("/useNg", useNgData);
router.post("/deleteNg", deleteNgData)

module.exports = router;
