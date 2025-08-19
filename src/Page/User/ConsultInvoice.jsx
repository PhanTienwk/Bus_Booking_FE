import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message, Space, Descriptions, Tag, Divider } from "antd";
import { consultInvoice } from "../../services/InvoiceService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import moment from "moment";

const { Title, Text } = Typography;

export default function InvoiceLookup() {
  const navigate = useNavigate();
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [form] = Form.useForm();
  const [invoiceData, setInvoiceData] = useState(null);

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
      if (response.code === 1000) {
        message.success("Tra cứu hóa đơn thành công!");
        setInvoiceData(response.result);
        form.resetFields();
        setCaptchaText(generateCaptcha());
      } else {
        message.error("Tra cứu hóa đơn thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    form.setFieldsValue({ captcha: "" });
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 0: return <Tag color="red">Hủy</Tag>;
      case 1: return <Tag color="orange">Chờ thanh toán</Tag>;
      case 2: return <Tag color="blue">Đã thanh toán</Tag>;
      case 3: return <Tag color="green">Thành công</Tag>;
      default: return <Tag color="default">Không xác định</Tag>;
    }
  };

  const getPaymentMethod = (method) => {
    return method === 0 ? "Tiền mặt" : "Chuyển khoản";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const formatDateTime = (dateTime) => {
    return moment(dateTime).format("DD/MM/YYYY HH:mm");
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
          backgroundImage: "url('/images/admin_image/banner6.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
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
              rules={[{ required: true, message: "Vui lòng nhập mã hóa đơn" }]}
            >
              <Input placeholder="Nhập mã hóa đơn cần tra cứu" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^\d{10,11}$/, message: "Số điện thoại phải có 10 hoặc 11 số!" },
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

          {invoiceData && (
            <>
              <Divider orientation="left">Chi tiết hóa đơn</Divider>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Tên">{invoiceData.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{invoiceData.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{invoiceData.phone}</Descriptions.Item>
                <Descriptions.Item label="Số lượng vé">{invoiceData.number_of_tickets}</Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {getPaymentMethod(invoiceData.payment_method)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{getStatusTag(invoiceData.status)}</Descriptions.Item>
                <Descriptions.Item label="Tổng số tiền">{formatCurrency(invoiceData.total_amount)}</Descriptions.Item>
                <Descriptions.Item label="Bến khởi hành">{invoiceData.nameStationFrom}</Descriptions.Item>
                <Descriptions.Item label="Bến đến">{invoiceData.nameStationTo}</Descriptions.Item>
                <Descriptions.Item label="Thời gian khởi hành">
                  {formatDateTime(invoiceData.departureTime)}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Card>
      </div>
      <Footer />
    </>
  );
}