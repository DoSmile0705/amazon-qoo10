import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "../components/EditModal";
import ExhibitionSettingModal from "../components/ExhibitionSettingModal";
import {
  addProduct,
  addProductByFile,
  deleteProduct,
  getAllProducts,
  getQoo10Category,
} from "../redux/reducers/productSlice";
import { UploadOutlined } from "@ant-design/icons";
import {
  Spin,
  Table,
  Button,
  Pagination,
  Input,
  message,
  Upload,
  Divider,
  Progress,
} from "antd";

const Product = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [newItems, setNewItems] = useState([]);
  const [file, setFile] = useState(null);
  const [asin, setAsin] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showExhibitionModal, setShowExhibitionModal] = useState(false);
  const { products, loading, successMsg, uploading } = useSelector(
    (state) => state.product
  );
  const { userInfo } = useSelector((state) => state.auth);
  const [table_products, SetTable_products] = useState(products || []);
  const [error_Msg, SetError_Msg] = useState(null);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
  const success = () => {
    messageApi.open({
      type: "success",
      content: successMsg,
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: error_Msg,
    });
    SetError_Msg(null);
  };

  useEffect(() => {
    if (successMsg) {
      success();
    } else if (error_Msg) {
      warning();
    }
  }, [successMsg, error_Msg]);
  useEffect(() => {
    const keyProducts = products.map((product, index) => {
      return { ...product, key: index };
    });
    SetTable_products(keyProducts);
  }, [loading, uploading, products]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(getAllProducts(localStorage.getItem("userId")));
    }, 3600000);
    return () => {
      clearTimeout(timeoutId);
    };
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const asin = event.target.elements.asin.value;
    setAsin("");
    dispatch(
      addProduct({ asin: asin, userId: localStorage.getItem("userId") })
    );
  };

  const handleEditClick = (index) => {
    const product = products[index];
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  const exhibitionSettingClick = () => {
    const data = selectedRowKeys.filter((key) => {
      return products[key].status === "新規追加";
    });
    if (data.length) {
      setShowExhibitionModal(true);
    } else {
      SetError_Msg("出品する商品がございません。");
    }
    setNewItems(data);
  };
  const onFileChange = (info) => {
    setFile(info.file);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userInfo._id);
    dispatch(addProductByFile(formData));
    setTimeout(function () {
      dispatch(getAllProducts(localStorage.getItem("userId"), products.length));
    }, 40000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const columns = [
    {
      title: "画 像",
      width: 50,
      dataIndex: "qoo10_img",
      key: "_id",
      fixed: "left",
      render: (text) => (
        <img src={text} alt={text} className="m-auto w-[50px]" />
      ),
    },
    {
      title: "タイトル",
      width: 120,
      dataIndex: "title",
      key: "_id",
      render: (title) => <label>{title?.slice(0, 18)}...</label>,
    },
    {
      title: "購入価格(円)",
      width: 80,
      dataIndex: "price",
      key: "_id",
    },
    {
      title: "出品価格(円)",
      width: 80,
      dataIndex: "qoo10_price",
      key: "_id",
    },
    {
      title: "見込み利益(円)",
      width: 80,
      dataIndex: "predictableIncome",
      key: "_id",
    },
    {
      title: "販売数量",
      width: 60,
      dataIndex: "selledQuantity",
      key: "_id",
    },
    {
      title: "出品数量",
      width: 60,
      dataIndex: "qoo10_quantity",
      key: "_id",
    },
    {
      title: "状 態",
      width: 80,
      dataIndex: "status",
      key: "_id",
      fixed: "right",
    },
    {
      title: "オプション",
      width: 100,
      key: "_id",
      fixed: "right",
      render: (_, record) => (
        <>
          <Button
            disabled={loading}
            onClick={() => handleEditClick(record.key)}
            className="primary mr-3"
          >
            変 更
          </Button>
          <Button
            disabled={loading}
            onClick={() => dispatch(deleteProduct(record))}
            type="primary "
            className="danger"
          >
            削 除
          </Button>
        </>
      ),
    },
  ];
  useEffect(() => {
    setTimeout(function () {
      dispatch(getAllProducts(localStorage.getItem("userId"), products.length));
    }, 120000);
  }, [products]);
  return (
    <section className="flex gap-3 px-3 py-3 w-full  absolute h-[92vh] z-10 ">
      {contextHolder}
      <div className=" w-full h-full overflow-auto">
        <div className="card h-full w-full flex flex-col justify-between  z-0">
          <Table
            columns={columns}
            loading={loading}
            className="max-w-[65vw] main-table mx-auto mt-10 max-h-[80vh]"
            rowSelection={rowSelection}
            dataSource={table_products}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            scroll={{
              y: 500,
              x: 1400,
            }}
          />
        </div>
      </div>
      <div className=" flex flex-col justify-between card h-full py-5 ">
        <div className=" card-3  h-full flex flex-col  justify-between">
          <div className=" relative items-center ">
            <form
              className=" justify-between shadow-none pb-2 pt-5 min-w-[300px] items-center w-full "
              onSubmit={handleSubmit}
            >
              <label
                htmlFor="asin"
                className="text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
              >
                商品登録
              </label>
              <div className="mt-8">
                <Input
                  className="mb-2 border-b-1 border-blue-300 text-very-dark-blue placeholder-grayish-blue focus:outline-none focus:border-blue-300 px-1 md:p-2 bg-white w-full"
                  id="asin"
                  type="text"
                  value={asin}
                  onChange={(e) => {
                    setAsin(e.target.value);
                  }}
                  placeholder="ASINコード入力"
                />
                <Button
                  disabled={loading}
                  className="primary h-[40px] w-full tracking-widest mb-2"
                  htmlType="submit"
                >
                  追 加
                </Button>
                <Divider></Divider>
                <div className="w-full flex gap-5 justify-center items-center">
                  <Upload
                    name="file"
                    beforeUpload={(file, FIleList) => false}
                    action=""
                    onChange={onFileChange}
                    multiple={false}
                    className="w-full flex"
                  >
                    <Button
                      disabled={loading}
                      className=" w-full h-auto"
                      icon={<UploadOutlined />}
                    >
                      ファイル
                      <br />
                      を読み込む
                    </Button>
                  </Upload>
                  {!file && (
                    <div className="w-full">
                      <span>*.xlsx</span>
                    </div>
                  )}
                </div>
                <Button
                  disabled={!file || loading}
                  className="primary w-full mt-5"
                  onClick={onFileUpload}
                >
                  送信
                </Button>
                <Divider />
              </div>
            </form>
          </div>
          <div className="px-[40px] pb-[10px] w-[300px] ">
            <label
              htmlFor="asin"
              className="text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
            >
              出 品 設 定
            </label>

            <Button
              disabled={loading}
              onClick={exhibitionSettingClick}
              className="primary h-[40px] w-full tracking-widest mt-8 mb-2"
            >
              設 定
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 h-full w-[100vw] bg-black/80 flex justify-center items-center z-10">
          <EditModal
            selectedProduct={selectedProduct}
            onClick={handleModalClose}
          />
        </div>
      )}
      {showExhibitionModal && (
        <div className="fixed top-0 left-0 h-full w-[100vw] bg-black/80 flex justify-center items-center z-10">
          <ExhibitionSettingModal
            onClick={() => {
              setShowExhibitionModal(false);
            }}
            checkedItems={newItems}
          />
        </div>
      )}
    </section>
  );
};

export default Product;
