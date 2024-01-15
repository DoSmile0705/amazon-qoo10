const express = require("express");
const bodyParser = require("body-parser");
const SellingPartner = require("amazon-sp-api");
const app = express();
const Product = require("../models/Product");
const NgData = require("../models/NgData");
const { updatePrice, UpdateMydbOfQoo10 } = require("./qoo10ProductManage");

require("dotenv").config({
  path: `../`,
});
app.use(bodyParser.json());

// Function to get Access Token using Refresh Token
async function getAccessToken() {
  try {
    const spClient = new SellingPartner({
      region: "fe",
      refresh_token: process.env.REFRESH_TOKEN,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
      },
      options: {
        auto_request_tokens: false,
      },
    });
    await spClient.refreshAccessToken();
    let access_token = spClient.access_token;
    return access_token;
  } catch (error) {
    console.log("sss", error);
  }
}
const getAmazonProduct = async (asin) => {
  try {
    // Get Access Token
    const accessToken = await getAccessToken();
    // Make request to Amazon SP API
    const spClient = new SellingPartner({
      region: "fe",
      refresh_token: process.env.REFRESH_TOKEN,
      access_token: accessToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID: process.env.CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET: process.env.CLIENT_SECRET,
      },
    });
    let catalog_item = await spClient.callAPI({
      operation: "getCatalogItem",
      endpoint: "catalogItems",
      path: {
        asin: asin,
      },
      query: {
        marketplaceIds: "A1VC38T7YXB528",
        includedData:
          "attributes,dimensions,identifiers,images,productTypes,relationships,salesRanks,summaries",
        locale: "ja_JP",
      },
      options: {
        version: "2022-04-01",
      },
    });

    return catalog_item;
  } catch (error) {
    console.error("ddd", error);
  }
};

const addProductToMydb = async (req, res) => {
  try {
    const asin = req.body.asin;
    const catalog_item = await getAmazonProduct(asin);
    let product = await Product.findOne({
      asin: asin,
      userId: req.body.userId,
    });
    if (product) {
      return res.status(400).send("製品はすでに存在します");
    }
    let bullet_point = "";
    catalog_item.attributes.bullet_point.map((des) => {
      bullet_point += des.value;
    });
    product = new Product({
      asin: asin,
      userId: req.body.userId,
      title: catalog_item.summaries[0].itemName,
      SecondSubCat: null,
      img: catalog_item.images[0].images,
      description: catalog_item.attributes.product_description
        ? catalog_item.attributes.product_description[0].value
        : bullet_point,
      price: catalog_item.attributes.list_price[0].value,
      qoo10_price: null,
      predictableIncome: null,
      bullet_point: catalog_item.attributes.bullet_point,
      item_weight: catalog_item.attributes.item_weight[0],
      item_package_weight: catalog_item.attributes.item_package_weight,
      item_dimensions: catalog_item.dimensions[0].item,
      quantity: "0",
      package: catalog_item.dimensions[0].package,
      brand: catalog_item.summaries[0].brand,
      part_number: catalog_item.summaries[0].part_number,
      manufacturer: catalog_item.summaries[0].manufacturer,
      recommended_browse_nodes:
        catalog_item.attributes.recommended_browse_nodes[0],
      releaseDate: catalog_item.summaries[0].releaseDate,
      itemClassification: catalog_item.summaries[0].itemClassification,
      websiteDisplayGroup: catalog_item.summaries[0].websiteDisplayGroup,
      websiteDisplayGroupName:
        catalog_item.summaries[0].websiteDisplayGroupName,
      AdultYN: catalog_item.summaries[0].adultProduct,
    });

    await product.save();
    res.json({ product: product, message: "商品登録成功" });
  } catch (error) {}
};
const getAllProductOfMydb = async (req, res) => {
  Product.find({ userId: req.query.userId })
    .then((products) => {
      res.json({ products });
      return products;
    })
    .catch((err) =>
      res.status(404).json({ nopostfound: "製品が見つかりませんでした" })
    );
};

const updateProductOfMydb = async (req, res) => {
  // console.log((req.body));
  Product.updateOne(
    { asin: req.body.asin, userId: req.body.userId },
    { $set: req.body }
  )
    .then((product) =>
      res.json({ product: product, message: "商品情報変更成功" })
    )
    .catch((err) => res.status(404).json({ nopostfound: "No Products found" }));
};
const updateProductOfMydbRelatedToTime = async () => {
  const products = await Product.find();
  if (products.length) {
    products.map(async (product, index) => {
      const asin = product.asin;
      const catalog_item = await getAmazonProduct(asin);
      const price = catalog_item?.attributes.list_price[0].value;
      const qoo10_price =
        price + product.odds_amount + (price * product.bene_rate) / 100;
      Product.updateOne(
        { asin: asin },
        { $set: { price: price, qoo10_price: qoo10_price } }
      )
        .then((product) => {})
        .catch((err) => {
          console.log(err);
        });
      if (product.status === "出品済み") {
        updatePrice(product.ItemCode, qoo10_price);
        UpdateMydbOfQoo10(product.ItemCode, product.qoo10_quantity);
      }
    });
  }
  setTimeout(function () {
    updateProductOfMydbRelatedToTime();
  }, 1800000);
};
updateProductOfMydbRelatedToTime();
const exhibitProducts = async (req, res) => {
  await req.body.map(async (product, index) => {
    await Product.findOneAndUpdate(
      { _id: product._id },
      { status: product.status }
    );
  });
  const data = await Product.find({ status: "新規追加" });
  let asins = data.map((pro) => {
    return { flag: false, value: pro.asin };
  });
  let ngData = await NgData.find();
  if (data.length) {
    if (ngData.length) {
      await NgData.updateOne(
        { _id: ngData[0]._id },
        { ngasin: [...ngData[0].ngasin, ...asins] }
      )
        .then((products) =>
          res.status(200).json({ message: "ngword successfully inserted" })
        )
        .catch((err) =>
          res.status(404).json({ nopostfound: "No Products found" })
        );
    } else {
      ngData = new NgData({
        ngword: undefined,
        excludeword: undefined,
        ngcategory: undefined,
        ngasin: asins,
        ngbrand: undefined,
      });
      await ngData.save();
    }
  }

  await Product.deleteMany({ status: "新規追加" });
};

module.exports = {
  getAllProductOfMydb,
  updateProductOfMydb,
  exhibitProducts,
  addProductToMydb,
};
