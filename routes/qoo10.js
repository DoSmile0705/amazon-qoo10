const express = require("express");
const router = express.Router();
const { setNewGoods, getQoo10Category } = require("../controller/qoo10ProductManage");

router.post("/exhibit", setNewGoods);
router.get("/category", getQoo10Category);

module.exports = router;
