import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditModal from "../components/EditModal";
import ExhibitionSettingModal from "../components/ExhibitionSettingModal";
import { addProduct, getAllProducts, getQoo10Category } from "../redux/reducers/productSlice";
import { Spin, Table, Button, Pagination, Input, message } from 'antd';


const Product = () => {
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState({});
  const [newItems, setNewItems] = useState([]);

  const [isnew, setIsnew] = useState(false);
  const [asin, setAsin] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [showModal, setShowModal] = useState(false);
  const [showExhibitionModal, setShowExhibitionModal] = useState(false);
  const { products, loading, successMsg, uploading } = useSelector((state) => state.product); // Accessing state.products using useSelector
  const [table_products, SetTable_products] = useState(products || []);
  const [error_Msg, SetError_Msg] = useState(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);

  };
  const success = () => {
    messageApi.open({
      type: 'success',
      content: successMsg,
    });
  };
  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: error_Msg,
    });
    SetError_Msg(null);
  };

  useEffect(() => {
    dispatch(getQoo10Category());
    dispatch(getAllProducts(localStorage.getItem('userId')));

  }, [uploading]);
  useEffect(() => {
    if (successMsg) {
      success();
    } else if (error_Msg) {
      warning();
    }
  }, [successMsg, error_Msg]);
  useEffect(() => {
    SetTable_products(products.slice(currentPage * pageSize, pageSize))

  }, [loading, pageSize, currentPage]);
  
 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(getAllProducts(localStorage.getItem('userId')));
    }, 5000); // Delay of 2000 milliseconds (2 seconds)
    return () => {
      clearTimeout(timeoutId);
    };
  })
  const handleSubmit = async (event) => {
    event.preventDefault();
    const asin = event.target.elements.asin.value;
    setAsin('');
    dispatch(addProduct({ asin: asin, userId: localStorage.getItem('userId') }));
  };

  const handleRowClick = (index, product) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
    if (product.qoo10_price === null || product.bene_rate === null || product.odds_amount === null || product.transport_fee === null) {

      SetError_Msg('出品価格、利潤、追加金、郵送費項目の一部が入力されない');
    } else if (product.status !== '新規追加') {
      SetError_Msg('出品された商品です');

    } else {
      setIsnew(true);
      setNewItems((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    }

  };

  const handleAllSelectChange = (event) => {
    const isChecked = event.target.checked;
    const updatedCheckedItems = {};
    const updatedNewItmes = [];

    if (isChecked) {
      products.forEach((data, index) => {
        updatedCheckedItems[index] = true;
        if (data.status === '新規追加') {
          updatedNewItmes[index] = true;
        }
      });
    }
    setCheckedItems(updatedCheckedItems);
    setNewItems(updatedNewItmes);
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
    if (newItems.length || isnew) {
      setShowExhibitionModal(true);
      
    }
  };

  return (

    <section className="flex gap-3 px-3 py-3 w-full  absolute h-[92vh] z-10 ">
      {contextHolder}
      <div className="items-center w-full h-full">
        <div className="card h-full w-full flex flex-col justify-between">
          <Spin  spinning={loading} className="h-full">
            <table className=" h-full w-full border border-gray-400 rounded-md  text-center text-sm font-light  table-auto mt-20">
              <thead className="border-b font-medium border-gray-400 bg-light-grayish-blue">
                <tr className="h-[50px]">
                  <th className="w-[3%]  border-r px-2 py-2 border-gray-400">
                    <Input
                      type="checkbox"
                      id="allSelect"
                      name="checkbox"
                      value=""
                      onChange={handleAllSelectChange} // Add onChange event handler
                    />
                  </th>
                  <th className="w-[5%] border px-2 py-1 border-gray-400">
                    番 号
                  </th>
                  <th className="w-[10%] border px-2 py-1 border-gray-400">
                    画 像
                  </th>
                  <th className="w-[20%] border px-2 py-1 border-gray-400">
                    タイトル
                  </th>

                  <th className="w-[10%] border px-2 py-1 border-gray-400">
                    購入価格(円)
                  </th>
                  <th className="w-[10%] border px-2 py-1 border-gray-400">
                    出品価格(円)
                  </th>
                  <th className="w-[10%] border px-2 py-1 border-gray-400">
                    見込み利益(円)
                  </th>
                  <th className="w-[20%] border px-2 py-1 border-gray-400">
                    状態
                  </th>
                  <th className="w-[20%] border px-2 py-1 border-gray-400">
                    状態
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  table_products.map((product, index) => (
                    <tr
                      key={index}
                      className="cursor-pointer h-[50px] border-b border-gray-400 hover:bg-grayish-blue"
                      onClick={() => handleRowClick(index, product)}
                    >
                      <td className=" border-r font-medium border-gray-400">
                        <Input
                          type="checkbox"
                          id={index}
                          name="checkbox"
                          value={index}
                          checked={checkedItems[index] || false}
                          onChange={() => handleRowClick(index)}
                        />
                      </td>
                      <td className="border-r font-medium border-gray-400">
                        {index + 1}
                      </td>
                      <td className="border-r border-gray-400">
                        <img
                          src={product?.img[0].link}
                          alt={index}
                          className="m-auto w-[50px]"
                        />
                      </td>
                      <td className="border-r border-gray-400 break-words">
                        <div className="text-container w-[100%]">{product.title}</div>
                      </td>

                      <td className="border-r border-gray-400">
                        {product.price}
                      </td>
                      <td className="border-r border-gray-400">
                        {product.qoo10_price || '未決定'}
                      </td>
                      <td className="border-r border-gray-400">
                        {product.predictableIncome || '未決定'}
                      </td>
                      <td className="border-r border-gray-400">
                        {product.status}
                      </td>
                      <td className="border-r border-gray-400">
                        <Button
                          onClick={() => handleEditClick(index)}
                          className="primary"
                        >
                          編 集
                        </Button>
                      </td>

                    </tr>
                  ))}
              </tbody>
            </table>
          </Spin>
          <div>
            <Pagination
              className="flex justify-end items-end mb-5 mr-5 mt-2"
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              defaultCurrent={3}
              total={products.length}
            />
          </div>
        </div>
      </div>
      <div className=" flex flex-col justify-between card h-full py-10">
        <div className=" card-3  h-full flex flex-col justify-between">
          <div className=" relative pt-10 pb-12 items-center ">
            <form
              className=" justify-between shadow-none min-w-[300px] items-center w-full "
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
                  onChange={(e) => { setAsin(e.target.value) }}
                  placeholder="ASINコード入力"
                />
                <button
                  className=" h-[40px] w-full flex justify-center items-center rounded-md mb-2 text-white  border border-blue shadow-[inset_0_0_0_0_#ffede1] hover:shadow-[inset_0_-4rem_0_0_#909de9] hover:text-white transition-all duration-300"
                  type="submit"
                >
                  追 加
                </button>
              </div>
            </form>
          </div>
          <div className="p-[40px] w-[300px] ">
            <label
              htmlFor="asin"
              className="text-[16px] font-semibold text-gray-700 border-b-2 border-dark-grayish-blue pb-2"
            >
              出 品 設 定
            </label>

            <Button
              onClick={exhibitionSettingClick}
              className="h-[40px] w-full mt-8 rounded-md mb-2 text-white flex items-center justify-center border border-blue shadow-[inset_0_0_0_0_#ffede1] hover:shadow-[inset_0_-4rem_0_0_#909de9] hover:text-white transition-all duration-300"
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
