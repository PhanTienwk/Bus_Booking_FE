import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message, Space } from "antd";
import { consultTicket } from "../../services/ticketService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [captchaText, setCaptchaText] = useState(generateCaptcha());
  const [form] = Form.useForm();
  const [ticketInfo, setTicketInfo] = useState(null);
  const printRef = useRef();

  function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  const handleSubmit = async (values) => {
    const { ticketId, phone, captcha } = values;

    if (captcha !== captchaText) {
      message.error("CAPTCHA không đúng! Vui lòng thử lại.");
      setCaptchaText(generateCaptcha());
      form.setFieldsValue({ captcha: "" });
      return;
    }
    try {
      const response = await consultTicket(ticketId, phone);
      if (response.code === 1000) {
        message.success("Tra cứu vé xe thành công!");
        setTicketInfo({
          name: response.result.nameUser || "N/A",
          email: response.result.emailUser || "N/A",
          seat: response.result.nameSeatPosition || "N/A",
          departure: response.result.nameStationFrom || "N/A",
          destination: response.result.nameStationTo || "N/A",
          departureTime: response.result.departureTime || "N/A",
          status: response.result.status || 0,
        });
        form.resetFields();
        setCaptchaText(generateCaptcha());
      } else {
        message.error("Tra cứu vé xe thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    form.setFieldsValue({ captcha: "" });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Hủy";
      case 1:
        return "Đã đặt";
      case 2:
        return "Chờ xử lý";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đổi vé";
      default:
        return "Không xác định";
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime || dateTime === "N/A") return "N/A";
    try {
      return format(new Date(dateTime), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (error) {
      console.error("Lỗi khi format thời gian:", error);
      return dateTime;
    }
  };

  const handlePrint = () => {
  if (!ticketInfo) {
    message.error("Không có thông tin vé để in!");
    return;
  }

  const WinPrint = window.open("", "", "width=900,height=650");
  WinPrint.document.write(`
    <html>
      <head>
        <title>In vé xe - ${ticketInfo?.seat || "N/A"}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 2px solid #004aad;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 20px;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 2px dashed #004aad;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .ticket-header img.logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .ticket-header h1 {
            color: #004aad;
            font-size: 28px;
            margin: 0;
            font-weight: bold;
          }
          .ticket-header p {
            color: #333;
            font-size: 16px;
            margin: 5px 0;
          }
          .ticket-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            font-size: 16px;
            color: #333;
          }
          .ticket-body p {
            margin: 10px 0;
            line-height: 1.5;
          }
          .ticket-body .label {
            font-weight: bold;
            color: #004aad;
          }
          .ticket-footer {
            text-align: center;
            margin-top: 20px;
            border-top: 2px dashed #004aad;
            padding-top: 15px;
          }
          .ticket-footer .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #ccc;
            display: inline-block;
            margin: 10px 0;
            border-radius: 5px;
          }
          .ticket-footer p {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .ticket-info {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
          @media print {
            body {
              background: white;
              margin: 0;
            }
            .ticket {
              box-shadow: none;
              border: none;
            }
            .ticket-header img.logo {
              filter: grayscale(100%);
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <img src="https://via.placeholder.com/120" alt="Logo" class="logo" />
            <h1>VÉ XE KHÁCH</h1>
            <p>CÔNG TY VẬN TẢI BUS BOOKING</p>
          </div>
          <div class="ticket-body">
            <p><span class="label">Tên khách hàng:</span> ${ticketInfo.name}</p>
            <p><span class="label">Email:</span> ${ticketInfo.email}</p>
            <p><span class="label">Vị trí ghế:</span> ${ticketInfo.seat}</p>
            <p><span class="label">Bến xuất phát:</span> ${ticketInfo.departure}</p>
            <p><span class="label">Bến đến:</span> ${ticketInfo.destination}</p>
            <p><span class="label">Thời gian xuất phát:</span> ${formatDateTime(ticketInfo.departureTime)}</p>
            <p><span class="label">Trạng thái:</span> ${getStatusText(ticketInfo.status)}</p>
          </div>
          <div class="ticket-info">
            <p><span class="label">Lưu ý:</span> Vui lòng có mặt tại bến xe trước giờ khởi hành ít nhất 30 phút.</p>
            <p>Vé chỉ có giá trị cho hành khách và chuyến xe được chỉ định.</p>
          </div>
          <div class="ticket-footer">
            <div class="qr-placeholder"></div>
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Liên hệ hỗ trợ: 1900 1234 | Email: support@busbooking.com</p>
            <p>Website: www.busbooking.com</p>
          </div>
        </div>
      </body>
    </html>
  `);
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
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
            Tra cứu vé xe
          </Title>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ maxWidth: 400, margin: "0 auto" }}
          >
            <Form.Item
              label="Mã vé xe"
              name="ticketId"
              rules={[{ required: true, message: "Vui lòng nhập mã vé xe" },
                {
                  pattern: /^\d+$/,
                  message: "Mã vé phải là số",
                },
              ]}
            >
              <Input placeholder="Nhập mã vé xe cần tra cứu của bạn" />
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
                Tra cứu vé xe
              </Button>
            </Form.Item>
          </Form>

          {ticketInfo && (
            <Card
              title="Thông tin vé xe"
              style={{
                marginTop: 24,
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Form layout="vertical">
                <Form.Item label="Tên người đặt">
                  <Input value={ticketInfo.name} readOnly />
                </Form.Item>
                <Form.Item label="Email người đặt">
                  <Input value={ticketInfo.email} readOnly />
                </Form.Item>
                <Form.Item label="Vị trí ghế">
                  <Input value={ticketInfo.seat} readOnly />
                </Form.Item>
                <Form.Item label="Bến xuất phát">
                  <Input value={ticketInfo.departure} readOnly />
                </Form.Item>
                <Form.Item label="Bến tới">
                  <Input value={ticketInfo.destination} readOnly />
                </Form.Item>
                <Form.Item label="Thời gian xuất phát">
                  <Input value={formatDateTime(ticketInfo.departureTime)} readOnly />
                </Form.Item>
                <Form.Item label="Trạng thái">
                  <Input value={getStatusText(ticketInfo.status)} readOnly />
                </Form.Item>
                {ticketInfo.status === 1 && (
                  <Form.Item>
                    <Button type="default" onClick={handlePrint} block>
                       In vé xe
                   </Button>
                  </Form.Item>
                )}
              </Form>
            </Card>
          )}
        </Card>
      </div>
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <div>
            <h2>Thông tin vé xe</h2>
            <p><strong>Tên người đặt:</strong> {ticketInfo?.name}</p>
            <p><strong>Email người đặt:</strong> {ticketInfo?.email}</p>
            <p><strong>Vị trí ghế:</strong> {ticketInfo?.seat}</p>
            <p><strong>Bến xuất phát:</strong> {ticketInfo?.departure}</p>
            <p><strong>Bến tới:</strong> {ticketInfo?.destination}</p>
            <p><strong>Thời gian xuất phát:</strong> {ticketInfo ? formatDateTime(ticketInfo.departureTime) : ""}</p>
            <p><strong>Trạng thái:</strong> {ticketInfo ? getStatusText(ticketInfo.status) : ""}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}