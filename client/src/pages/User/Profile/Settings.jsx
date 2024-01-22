import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { removeError } from "../../../redux/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select } from "antd";
import {
  cancelUpdate,
  enableUpdate,
  updateUser,
} from "../../../redux/reducers/authSlice";

const Settings = () => {
  const [form] = Form.useForm();
  const formItemLayout = {
    labelAlign: "left",
    labelCol: {
      xs: {
        span: 6,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 26,
      },
      sm: {
        span: 18,
      },
    },
  };
  const {
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const { userInfo, loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { reset } = useForm();
  const removeErrMsg = () => {
    dispatch(removeError());
  };
  useEffect(() => {
    dispatch(cancel);
  }, []);

  const cancel = () => {
    document.title = "Profile Settings";

    reset({
      username: userInfo.username,
      phone: userInfo.phone || "",
      email: userInfo.email,
      gender: userInfo.gender || "",
    });
    dispatch(cancelUpdate());
  };

  const submitForm = (data) => {
    dispatch(updateUser(data));
  };

  return (
    <>
      <h3 className="text-xl leading-6 font-bold text-gray-900">個人情報</h3>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        ここで個人情報を更新してください。
      </p>
      <hr className="border-b border-grayish-blue mt-3 mb-8" />

      <Form
        form={form}
        name="normal_login"
        className="login-form pt-5 text-left px-6 min-w-full h-[344px]"
        initialValues={{ remember: true }}
        onChange={removeErrMsg}
        onFinish={submitForm}
      >
      
       
        <Form.Item
          name="phone"
          label="電話番号"
          {...formItemLayout}
          rules={[
            {
              type: "text",
              message: "入力された電子メールは無効です。",
            },
            {
              message: "メールアドレスを入力してください。",
            },
          ]}
          hasFeedback
        >
          <InputNumber
            defaultValue={userInfo.phone}
            prefix={<UserOutlined className="site-form-item-icon" />}
            size="large"
            placeholder="business@gmail.com"
            {...register("email")}
          />
        </Form.Item>
        
        <Form.Item shouldUpdate className="w-full">
          {() => (
            <div className="text-right">
              <Button
                className="primary w-[120px]  m-auto mb-3 mt-3"
                type="default"
                htmlType="submit"
                size="large"
                disabled={
                  loading ||
                  // !clientReady ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                {loading ? (
                  <div
                    className=" spinner-border animate-spin inline-block w-4 h-4 border rounded-full"
                    role="status"
                  >
                    <span className="sr-only">ローディング中...</span>
                  </div>
                ) : (
                  <span className="text-[12px]">更新</span>
                )}
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default Settings;
