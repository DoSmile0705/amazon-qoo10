const axios = require("axios");
const XLSX = require("xlsx");
const Category = require("../models/category");
const Product = require("../models/Product");
const NgData = require("../models/NgData");

const workbook = XLSX.readFile("./qoo10category.xlsx");
const worksheet = workbook.Sheets["Qoo10_CategoryInfo"];
const createCategory = async () => {
  const qoo10categorys = await Category.find();
  if (qoo10categorys.length === 0) {
    const good = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const documents = good.map((row, index) => {
      if (index !== 0) {
        return {
          mainCategory: row[0],
          mainCategoryName: row[1],
          middleCategory: row[2],
          middleCategoryName: row[3],
          subCategory: row[4],
          subCategoryName: row[5],
        };
      }
    });
    Category.insertMany(documents)
      .then((result) => {})
      .catch((err) => {
        console.error("ドキュメントの挿入エラー:", err);
      })
      .finally(() => {});
  }
};
createCategory();
const CreateCertificationKey = async () => {
  const url =
    "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/CertificationAPI.qapi/CreateCertificationKey";
  const requestConfig = {
    headers: {
      Giosiscertificationkey: process.env.API_KEY,
    },
    params: {
      user_id: process.env.USER_ID,
      pwd: process.env.USER_PASSWORD,
    },
  };
  const result = await axios.get(url, requestConfig);
  return result.data.ResultObject;
};

const getQoo10Category = async (req, res) => {
  Category.find()
    .then((categories) => res.json({ categories }))
    .catch((err) =>
      res.status(404).json({ nopostfound: "No categories found" })
    );
};
const setNewGoods = async (req, res) => {
  const certificationKey = await CreateCertificationKey();
  const url =
    "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ItemsBasic.qapi/SetNewGoods";
  const products = req.body.passedProducts;
  let sentProducts = [];
  for (i = 0; i < products.length; i++) {
    const good = products[i];
    const requestConfig = {
      headers: {
        Giosiscertificationkey: certificationKey,
      },
      params: {
        SecondSubCat: good.SecondSubCat,
        OuterSecondSubCat: good.asin || "",
        Drugtype: "1C" || "",
        BrandNo: "",
        ItemTitle: good.title.slice(0, 40) || "",
        PromotionName: "",
        SellerCode: "",
        IndustrialCodeType: "",
        IndustrialCode: "",
        ModelNM: "",
        ManufactureDate: "",
        AdditionalOption: good.asin,
        ProductionPlaceType: "1" || "",
        ProductionPlace: good.manufacturer || "",
        Weight: good.package.weight.value || "",
        Material: "",
        AdultYN: good.AdultYN ? "Y" : "N",
        ContactInfo: "",
        StandardImage: good.img[0].link || "",
        VideoURL: null || "",
        ItemDescription: good.description || "",
        ItemType: "",
        RetailPrice: "11" || "",
        ItemPrice: good?.qoo10_price || good.price,
        ItemQty: good?.qoo10_quantity || 20,
        ExpireDate: "",
        ShippingNo: "",
        AvailableDateType: "0",
        AvailableDateValue: "1",
        Keyword: "",
      },
    };
    const qooResult = await axios.get(url, requestConfig);
    console.log(qooResult.data);
    if (!qooResult.data.ResultCode) {
      await Product.findOneAndUpdate(
        { _id: good._id },
        {
          status: good.status,
          ItemCode: qooResult.data.ResultObject.GdNo,
        }
      ).then(async () => {
        sentdata = await Product.find({ _id: good._id });
        sentProducts.push(sentdata);
      });
      const data = await Product.find({
        status: "新規追加",
        userId: good.userId,
      });
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
            .then((products) => {
              console.log("ngsuccess");
            })
            .catch((err) => {
              console.log("ngerror");
            });
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
    }
  }
  res.status(200).json({
    message: "qoo10に正確に出品されました。",
    status: true,
    products: sentProducts,
  });
  await Product.deleteMany({
    status: "新規追加",
    userId: req.body.user_id,
  });
};
const updatePrice = async (ItemCode, qoo10_price) => {
  const certificationKey = await CreateCertificationKey();
  const url =
    "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ItemsOrder.qapi/SetGoodsPriceQty";
  const requestConfig = {
    headers: {
      Giosiscertificationkey: certificationKey,
    },
    params: {
      ItemCode: ItemCode,
      SellerCode: "",
      Price: qoo10_price,
      Qty: "",
      ExpireDate: "",
    },
  };
  axios
    .get(url, requestConfig)
    .then(async (response) => {
      if (response) {
      }
    })
    .catch((error) => {
      // Handle the error
    });
};
const UpdateMydbOfQoo10 = async (ItemCode, last_quantity) => {
  const certificationKey = await CreateCertificationKey();
  const url = "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi";
  const requestConfig = {
    params: {
      key: certificationKey,
      ItemCode: ItemCode,
      SellerCode: "",
      v: 1.2,
      returnType: "json",
      method: "ItemsLookup.GetItemDetailInfo",
      Qty: "",
      ExpireDate: "",
    },
  };
  axios
    .get(url, requestConfig)
    .then(async (response) => {
      if (response) {
        await Product.findOneAndUpdate(
          { ItemCode: ItemCode },
          {
            selledQuantity:
              last_quantity - response.data.ResultObject[0]?.ItemQty,
            ItemStatus: response.data.ResultObject[0]?.ItemStatus,
          }
        )
          .then(async (response1) => {
            if (response1) {
            }
          })
          .catch((error) => {
            // Handle the error
          });
      }
    })
    .catch((error) => {
      // Handle the error
    });
};
const deleteProductOfQoo10Mydb = async (req, res) => {
  if (req.body.status == "出品済み") {
    const certificationKey = await CreateCertificationKey();
    console.log(certificationKey);
    const url =
      "https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi";
    const requestConfig = {
      params: {
        key: certificationKey,
        v: "1.0",
        returnType: "json",
        method: "ItemsOptions.DeleteInventoryDataUnit",
        ItemCode: req.body.ItemCode,
        SellerCode: "",
        OptionName: req.body.asin,
        OptionValue: "",
        OptionCode: "",
      },
    };
    axios
      .get(url, requestConfig)
      .then(async (response) => {
        if (response) {
          if (!response.data.ResultCode) {
            await Product.findOneAndDelete({ _id: req.body.id })
              .then((product) => {
                res.status(200).json(product);
              })
              .catch((error) => {
                res.status(404).json();
              });
          } else {
            res.status(404).json();
          }
        }
      })
      .catch((error) => {
        // Handle the error
        res.status(404).json();
      });
  } else {
    await Product.findOneAndDelete({ _id: req.body._id })
      .then((product) => {
        res.status(200).json(product);
      })
      .catch((error) => {
        res.status(404).json();
      });
  }
};
module.exports = {
  setNewGoods,
  updatePrice,
  getQoo10Category,
  UpdateMydbOfQoo10,
  deleteProductOfQoo10Mydb,
};
