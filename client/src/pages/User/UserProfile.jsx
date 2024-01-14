import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import Loading from "../../components/Loading";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Divider } from 'antd';
const UserProfile = () => {
  const { userInfo, loading, error, userErrorMsg, userToken } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="wrapper w-full h-full py-12 sm:py-8 flex items-center justify-center">
        <div className="flex gap-2 drop-shadow-md lg:bg-white rounded-md p-5">
          <div className=" text-center rounded-lg w-[200px] h-auto py-4 ">
            <Avatar size={64} icon={<UserOutlined />} />
            <h3 className="capitalize text-lg text-center my-6">
              <div className="font-bold ">
                {userInfo && (
                  <>
                    {userInfo.firstname} {userInfo.lastname}
                  </>
                )}
              </div>
            </h3>
            <nav className=" bg-white">
              <NavLink
                to=""
                className={({ isActive }) =>
                  "text-dark-grayish-blue group  px-3 py-2 flex items-center text-sm font-medium" +
                  (!isActive
                    ? " hover:bg-light-grayish-blue"
                    : "  bg-pale-orange border-orange hover:bg-pale-orange")
                }
                end
                aria-current="page"
                x-state-description='Current: "bg-pale-orange border-orange text-dark-grayish-blue", Default: "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"'
              >
                <ion-icon class="p-2 text-base" name="person"></ion-icon>
                <span className="truncate">私のアカウント</span>
              </NavLink>

              <NavLink
                to="password"
                className={({ isActive }) =>
                  "text-dark-grayish-blue group  px-3 py-2 flex items-center text-sm font-medium" +
                  (!isActive
                    ? " hover:bg-light-grayish-blue"
                    : "  bg-pale-orange border-orange hover:bg-pale-orange")
                }
                x-state-description='undefined: "bg-pale-orange border-orange text-dark-grayish-blue", undefined: "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"'
              >
                <ion-icon class="p-2 text-base" name="key"></ion-icon>
                <span className="truncate">パスワード</span>
              </NavLink>
              <NavLink
                to="settings"
                className={({ isActive }) =>
                  "text-dark-grayish-blue group  px-3 py-2 flex items-center text-sm font-medium" +
                  (!isActive
                    ? " hover:bg-light-grayish-blue"
                    : "  bg-pale-orange border-orange hover:bg-pale-orange")
                }
                x-state-description='undefined: "bg-pale-orange border-orange text-dark-grayish-blue", undefined: "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"'
              >
                <ion-icon class="p-2 text-base" name="settings"></ion-icon>
                <span className="truncate">個人情報の設定</span>
              </NavLink>
              <Divider />
              <div className="p-2">
                <Button
                  onClick={() => onLogOut()}
                  className="w-full mt-32 h-10 flex items-center gap-4  justify-center text-center "
                ><LogoutOutlined />
                  <span>ログアウト</span>
                </Button>
              </div>
            </nav>
          </div>
          <Divider type="vertical" className="h-[500px]"/>
          <div className=" w-[480px] p-8 pb-1">
            {userToken ? (
              <>
                {!error ? (
                  <>
                    {loading ? (
                      <div className=" w-full h-full flex items-center justify-center">
                        <Loading />
                      </div>
                    ) : (
                      <>
                        {userInfo ? (
                          <Outlet />
                        ) : (
                          <>
                            <NavLink
                              to="/login"
                              className="text-sm border-b-2 border-b-orange font-bold"
                            >
                              Login
                            </NavLink>{" "}
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <p className=" mt-20 text-center text-very-dark-blue">
                    {userErrorMsg}
                  </p>
                )}
              </>
            ) : (
              <>

              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default UserProfile;
