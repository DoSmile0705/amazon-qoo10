import { useEffect, useRef, useState } from "react";
import amazon_logo from "../../assets/amazon-logo.png";
import menu from "../../assets/icon-menu.svg";
import avatar from "../../assets/image-avatar.png";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetails } from "../../redux/reducers/authSlice";
import { Button, message, Avatar} from "antd";
import { getAllProducts } from "../../redux/reducers/productSlice";
import { UserOutlined } from '@ant-design/icons';


const Header = () => {
  const dispatch = useDispatch();
  const { userInfo,loading } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const {error, errMsg } = useSelector(
    (state) => state.auth
  );
  const {pro_error, pro_errMsg } = useSelector(
    (state) => state.product
  );
  //HAMBURGER MENU
  let navMenu = useRef(null);
  let darkScreen = useRef(null);
  let close = useRef(null);
  let hamburger = useRef(null);

  const displayMenu = () => {
    navMenu.current.classList.toggle("!translate-x-0");
    darkScreen.current.classList.toggle("!opacity-60");
    darkScreen.current.classList.toggle("!z-20");
    darkScreen.current.classList.toggle("!block");
    close.current.classList.toggle("!block");
    hamburger.current.classList.toggle("!hidden");
  };
  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: errMsg,
    });
  };
  const warning2 = () => {
    messageApi.open({
      type: 'warning',
      content: pro_errMsg,
    });
  };
  useEffect(() => {
    if (!userInfo) {
      dispatch(getUserDetails());
    }
  }, []);
  useEffect(() => {
    if(error&&errMsg){
      warning();
    }else if(pro_error&&pro_errMsg){
      warning2();
    }
  }, [error,pro_error]);


  return (
    <header className=" md:px-10 h-[8vh] flex justify-between items-center sm:px-3 mx-auto relative z-10 shadow-lg">
      {contextHolder}

      <div className="left flex items-center lg:h-inherit ">
        <div
          onClick={displayMenu}
          className="menu w-[100px] lg:hidden z-40 cursor-pointer"
        >
          <img ref={hamburger} src={menu} alt="menu-icon" />
          <div
            ref={close}
            className="close hidden text-xl leading-none fixed -mt-3 -ml-1 w-4"
          >
            <ion-icon name="close-outline"></ion-icon>
          </div>
        </div>
        <NavLink
          to=""
          className=" w-[250px] z-50 text-2xl font-black text-center  "
        >
          <span className="logo">無 在 庫 シ ス テ ム</span>
        </NavLink>
        <nav
          ref={navMenu}
          className="menu tracking-widest fixed inset-0 right-1/3 bg-white pt-20 z-30 h-screen px-10 -translate-x-full transition-all ease-in-out duration-500 lg:translate-x-0 lg:relative lg:w-max lg:p-0 lg:h-inherit lg:flex lg:items-center"
        >
          <ul className="font-bold lg:font-normal text-center lg:text-left lg:flex lg:items-center text-base lg:text-base pt-2 lg:p-0 lg:mx-9 lg:text-black lg:h-inherit">
            <li className="relative h-12 lg:h-inherit">
              <NavLink
                // onClick={displayMenu}
                to="/product"
                className={({ isActive }) =>
                  "absolute inset-0 mb-5 pt-[2.5px] font-bold lg:pt-0 lg:mb-0 lg:mx-4 lg:h-inherit lg:flex lg:items-center cursor-pointer lg:relative lg:before:content-[attr(before)] before:absolute before:-bottom-1 before:left-0 before:h-full before:-z-10 before:lg:z-10 before:lg:h-1 before:bg-orange before:w-0 hover:before:w-full before:transition-all lg:hover:text-very-dark-blue " +
                  (!isActive
                    ? ""
                    : "before:w-full text-white lg:text-very-dark-blue")
                }
              >
                製 品
              </NavLink>
            </li>
            <li className="relative ml-5 h-12 lg:h-inherit">
              <NavLink
                // onClick={displayMenu}
                to="/ng-setting"
                className={({ isActive }) =>
                  "absolute inset-0 mb-5 pt-[2.5px] font-bold text-base lg:pt-0 lg:mb-0 lg:mx-4 lg:h-inherit lg:flex lg:items-center cursor-pointer lg:relative lg:before:content-[attr(before)] before:absolute before:-bottom-1 before:left-0 before:h-full before:-z-10 before:lg:z-10 before:lg:h-1 before:bg-orange before:w-0 hover:before:w-full before:transition-all lg:hover:text-very-dark-blue " +
                  (!isActive
                    ? ""
                    : "before:w-full text-white lg:text-very-dark-blue")
                }
              >
                商品検査ワード管理
              </NavLink>
            </li>
          </ul>
          {!userInfo && (
            <ul className="">
              <li>
                <NavLink to="/login">
                  <Button 
                  className="h-10 w-full sm:hidden bg-orange px-4 rounded-lg lg:rounded-xl text-white flex items-center justify-center hover:bg-white shadow-[inset_0_0_0_0_rgba(255,125,26,0.6)] hover:shadow-[inset_0_-4rem_0_0_rgba(255,125,26,0.6)] transition-all duration-300">
                  ログイン
                  </Button>
                </NavLink>
              </li>
            </ul>
          )}
        </nav>
        
      </div>
      <div className="user-bar flex justify-between items-center">
        <div>
          <div className="user h-6 w-6 mx-2 sm:h-8 sm:w-8 md:w-10 md:h-10 lg:w-12 lg:h-12 hidden">
           <img src={avatar} alt="avatar" />
          </div>
          {!userInfo ? (
            <NavLink to="/login">
              <Button type="primary">
                 ログイン
              </Button>
            </NavLink>
          ) : (
            <NavLink to="/user-profile" className="cursor-pointer ml-4 lg:ml-0 lg:mt-2">
                <Avatar icon={<UserOutlined />} size={40}></Avatar>
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
