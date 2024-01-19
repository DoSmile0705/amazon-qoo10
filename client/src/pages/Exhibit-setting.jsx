import { Col, Form, Row } from "antd";
import React, { useState } from "react";

const ExhibitSetting = () => {
  return (
    <>
      <section className="flex gap-3 px-3 py-3 w-full  absolute h-[92vh] z-10 ">
        <div className="card h-full w-full z-0">
          <Row className="h-full w-full">
            <Col
              span={12}
              className="w-full h-full flex justify-center items-center "
            >
              <div className="w-[400px] h-[500px] p-10 card ">
                {/* <Form
                  form={form}
                  name="normal_login"
                  className="login-form pt-5 text-left px-6 min-w-full h-[344px]"
                  initialValues={{ remember: true }}
                  onChange={removeErrMsg}
                  onFinish={submitForm}
                >
                  <Form.Item
                    name="email"
                    label={
                      <label className="h-10">
                        電子メール
                        <br />
                        アドレス
                      </label>
                    }
                    {...formItemLayout}
                    rules={[
                      {
                        type: "email",
                        message: "入力された電子メールは無効です。",
                      },
                      {
                        message: "メールアドレスを入力してください。",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      defaultValue={userInfo.email}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      size="large"
                      placeholder="business@gmail.com"
                      {...register("email")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    label="ユーザー名"
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
                    <Input
                      defaultValue={userInfo.username}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      size="large"
                      placeholder="business@gmail.com"
                      {...register("email")}
                    />
                  </Form.Item>
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
                    <Input
                      defaultValue={userInfo.phone}
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      size="large"
                      placeholder="business@gmail.com"
                      {...register("email")}
                    />
                  </Form.Item>
                  <Form.Item
                    name="gender"
                    label="性 別"
                    {...formItemLayout}
                    rules={[{}]}
                  >
                    <Select
                      placeholder="男"
                      allowClear
                      size="large"
                      defaultValue={userInfo.gender}
                    >
                      <Option value="male">男</Option>
                      <Option value="female">女</Option>
                      <Option value="other">その他</Option>
                    </Select>
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
                            !!form
                              .getFieldsError()
                              .filter(({ errors }) => errors.length).length
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
                </Form> */}
              </div>
            </Col>
            <Col
              span={12}
              className="w-full h-full flex justify-center items-center"
            >
              <div className="w-[400px] h-[500px] p-10 card "></div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};
export default ExhibitSetting;
