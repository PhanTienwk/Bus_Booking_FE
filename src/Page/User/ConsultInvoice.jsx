import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message, Space } from "antd";
import {consultInvoice} from "../../services/InvoiceService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [form] = Form.useForm();

  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleSubmit = async (values) => {
    const { invoiceId, phone, captcha } = values;

    if (captcha !== captchaText) {
      message.error("CAPTCHA không đúng! Vui lòng thử lại.");
      setCaptchaText(generateCaptcha());
      form.setFieldsValue({ captcha: "" });
      return;
    }
    try {
      const response = await consultInvoice(invoiceId, phone);
      if(response.code === 1000){
      message.success("Yêu cầu khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.");
      form.resetFields();
      setCaptchaText(generateCaptcha());
      }else{
        message.error("Yêu cầu khôi phục mật khẩu thất bại. Vui lòng thử lại")
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    form.setFieldsValue({ captcha: "" });
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "24px",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
            Tra cứu hóa đơn
          </Title>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ maxWidth: 400, margin: "0 auto" }}
          >
            <Form.Item
              label="Mã hóa đơn"
              name="invoiceId"
              rules={[
                { required: true, message: "Vui lòng nhập mã hóa đơn" },
              ]}
            >
              <Input placeholder="Nhập mã hóa đơn cần tra cứu của bạn" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^\d{10,11}$/,
                  message: "Số điện thoại phải có 10 hoặc 11 số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item label="CAPTCHA">
              <Space align="center">
                <Text
                  style={{
                    fontFamily: "monospace",
                    fontSize: 18,
                    fontWeight: "bold",
                    backgroundColor: "#e0e0e0",
                    padding: "8px 16px",
                    borderRadius: 4,
                  }}
                >
                  {captchaText}
                </Text>
                <Button onClick={handleRefreshCaptcha}>Làm mới</Button>
              </Space>
            </Form.Item>
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: "Vui lòng nhập CAPTCHA!" }]}
            >
              <Input placeholder="Nhập CAPTCHA" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Tra cứu hóa đơn
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </>
  );
}