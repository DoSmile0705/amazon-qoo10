const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const NgData = require("../models/NgData");

app.use(bodyParser.json());

const addNgData = async (req, res) => {
  const reqData = req.body;
  console.log("just here", reqData);
  const isNgdata = await NgData.find({
    _id: reqData.userId,
  });
  if (!isNgdata.length) {
    const ngdata = new NgData({
      _id: reqData.userId,
    });
    await ngdata.save();
  }
  const is_exist_ngword = await NgData.find({
    _id: reqData.userId,
    "ngword.value": reqData.ngword?.value,
  });
  const is_exist_ngbrand = await NgData.find({
    _id: reqData.userId,
    "ngbrand.value": reqData.ngbrand?.value,
  });
  const is_exist_ngcategory = await NgData.find({
    _id: reqData.userId,
    "ngcategory.value": reqData.ngcategory?.value,
  });
  const is_exist_ngasin = await NgData.find({
    _id: reqData.userId,
    "ngasin.value": reqData.ngasin?.value,
  });
  const is_exist_excludeword = await NgData.find({
    _id: reqData.userId,
    "excludeword.value": reqData.excludeword?.value,
  });

  await NgData.updateOne(
    { _id: reqData.userId },
    {
      $push: {
        ngword: !is_exist_ngword.length ? reqData.ngword : undefined,
        ngbrand: !is_exist_ngbrand.length ? reqData.ngbrand : undefined,
        ngcategory: !is_exist_ngcategory.length
          ? reqData.ngcategory
          : undefined,
        ngasin: !is_exist_ngasin.length ? reqData.ngasin : undefined,
        excludeword: !is_exist_excludeword.length
          ? reqData.excludeword
          : undefined,
      },
    }
  )
    .then((ngdata) => res.status(200).json({ result: ngdata }))
    .catch((err) => res.status(404).json({ nopostfound: "No Data found" }));
};

const getAllNgData = async (req, res) => {
  NgData.find({ _id: req.params.id })
    .then((ngdata) => {
      res.json({ ngdata });
    })
    .catch((err) => res.status(404).json({ nopostfound: "No ngdata found" }));
};

const useNgData = async (req, res) => {
  const { kind, value, flag, editedValue, userId } = req.body.data;
  await NgData.findOneAndUpdate(
    {
      _id: userId,
      [[kind] + ".value"]: value,
    },
    {
      $set: { [[kind] + ".$.flag"]: flag, [[kind] + ".$.value"]: editedValue },
    }
  )
    .then((ngdata) =>
      res
        .status(200)
        .json({ ngdata: ngdata, message: "ngword successfully updated" })
    )
    .catch((err) => res.status(404).json({ nopostfound: "No ngword found" }));
};
const deleteNgData = async (req, res) => {
  const { kind, value, userId } = req.body.data;
  console.log(userId);
  await NgData.updateOne(
    {
      _id: userId,
    },
    { $pull: { [kind]: { value: value } } }
  )
    .then((ngdata) =>
      res
        .status(200)
        .json({ ngdata: ngdata, message: "ngword successfully deleted" })
    )
    .catch((err) => res.status(404).json({ nopostfound: "No ngword found" }));
};

module.exports = {
  addNgData,
  getAllNgData,
  useNgData,
  deleteNgData,
};
