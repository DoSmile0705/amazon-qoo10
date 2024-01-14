import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { exhibitProducts } from "../redux/reducers/productSlice";
import { getAllNgDatas } from "../redux/reducers/ngSlice";
import { CloseCircleOutlined } from '@ant-design/icons';


const ExhibitionSettingModal = (props) => {

  const [passedProducts, setPassedProduct] = useState();
  const [exceptedProducts, setExceptedProduct] = useState();

  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.products); // Accessing state.products using useSelector
  let ngDataObject = useSelector((state) => state.ng.ngdatas);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

  };

  const exhibit_Products = async (event) => {
    dispatch(exhibitProducts(passedProducts));
    props.onClick();
  };
  const ngCheck = () => {
    let checkProducts = [];
    let excepted_Products = [];

    productData.map((product, index) => {
      let title = product.title.toLowerCase();
      let Cbullet_point = '';
      product.bullet_point.map((bull) => {
        Cbullet_point += '-' + bull.value.toLowerCase();
      })
      let total = title + Cbullet_point;
      let asin = product.asin.toLowerCase();



      if (props.checkedItems[index]) {
        // -ngword check
        let isexcept = false;
        ngDataObject[0]?.ngword.map((word, index) => {
          if (!isexcept && word.flag) {
            if (total.includes(word.value.toLowerCase())) {
              isexcept = true;
            }
          }
        })
        // -ngcategory check
        if (!isexcept) {
          ngDataObject[0]?.ngcategory.map((category, index) => {
            if (!isexcept && category.flag) {
              // title check
              if (asin.includes(category.value.toLowerCase())) {
                isexcept = true;
              }
            }
          })
        }
        // -ngAsin check
        if (!isexcept) {
          ngDataObject[0]?.ngasin.map((ngas, index) => {
            if (!isexcept && ngas.flag) {
              // title check
              if (asin.includes(ngas.value.toLowerCase())) {
                isexcept = true;
              }
            }
          })
        }
        // -ngBrand check
        if (!isexcept) {
          ngDataObject[0]?.ngbrand.map((brand, index) => {
            if (!isexcept && brand.flag) {
              // title check
              if (asin.includes(brand.value.toLowerCase())) {
                isexcept = true;
              }
            }
          })
        }
        // input products
        if (!isexcept) {
          let editedTitle = '';
          let description = '';
          ngDataObject[0]?.excludeword.map((word) => {
            if (word.flag) {
              editedTitle = product.title.replace(word.value, '____');
              description = Cbullet_point.replace(word.value, '____');
            }
          })
          checkProducts.push({ ...product, title: editedTitle, description: description, status: '出品済み' });
        } else if (isexcept) {
          excepted_Products.push(product);
        }
      }

    })
    setPassedProduct(checkProducts)
    setExceptedProduct(excepted_Products)
  }
  useEffect(() => {
    dispatch(getAllNgDatas());
  }, [])
  return (
    <div className="w-[80%] h-[95vh]  py-3 bg-white">
      <div className="flex justify-end pt-3 pr-5">
        <a onClick={props.onClick}>
          <CloseCircleOutlined className="text-[30px] cursor-pointer" />
        </a>
      </div>
      <h2 className="text-center pt-[10px] pb-[10px] text-[26px] font-bold">
        出 品 設 定
      </h2>
      <div className="w-full ">
        <div className="w-[90%] mx-auto my-5">
          <div className="products-temple">
            <label className="check-kind">追加された製品</label>
            <div className="products-list flex gap-x-5 mt-1 justify-start">
              {productData?.map((product, index) => {
                if (props.checkedItems[index]) {
                  return (
                    <div key={index} className="product-item">
                      <img src={product.img[0].link}></img>
                      <label>{product.title}</label>
                    </div>
                  )
                }
              }) || '内容なし'}
            </div>
          </div>
          <div className="products-temple">
            <label className="check-kind">合格製品</label>
            <div className="products-list flex gap-x-5 mt-3 justify-start w-full">

              {passedProducts?.length ? passedProducts?.map((product, index) => {
                return (
                  <div key={index} className="product-item">
                    <img src={product.img[0].link}></img>
                    <label >{product.title}</label>
                  </div>
                )
              }) : '内容なし'}
            </div>
          </div>
          <div className="products-temple">
            <label className="check-kind">除外された商品</label>
            <div className="products-list flex gap-x-5 mt-3 justify-start">
              {exceptedProducts?.length ? exceptedProducts?.map((product, index) => {
                return (
                  <div key={index} className="product-item">
                    <img src={product.img[0].link}></img>
                    <label>{product.title}</label>
                  </div>
                )
              }) : '内容なし'}
            </div>
          </div>
          <div className="product_btns mx-5 flex gap-5">
            <button
              onClick={() => { ngCheck() }}
              className="blue-btn h-[40px] w-full flex justify-center items-center rounded-md mb-2 text-white  border border-blue shadow-[inset_0_0_0_0_#ffede1] hover:shadow-[inset_0_-4rem_0_0_#909de9] hover:text-white transition-all duration-300"
            > ng検査
            </button>
            <button
             onClick={() => { exhibit_Products() }}
              className="blue-btn h-[40px] w-full flex justify-center items-center rounded-md mb-2 text-white  border border-blue shadow-[inset_0_0_0_0_#ffede1] hover:shadow-[inset_0_-4rem_0_0_#909de9] hover:text-white transition-all duration-300"
            > 出 品
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionSettingModal;
