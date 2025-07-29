import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { Snackbar, Alert } from "@mui/material";
import Footer from "../../components/Footer";
import {
  fetchSeatLayout,
  handleSeatSelection,
  createInvoice,
} from "../../services/SeatSelectionService";
import { useNavigate } from "react-router-dom";

const SeatSelectionPage = () => {
  const { state } = useLocation();
  const tripDetails = state?.tripDetails;
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [upperSeats, setUpperSeats] = useState([]);
  const [lowerSeats, setLowerSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "0",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getSeatLayout = async () => {
      try {
        const { upperSeats, lowerSeats, bookedSeats } = await fetchSeatLayout(
          tripDetails.bus.id
        );
        setUpperSeats(upperSeats);
        setLowerSeats(lowerSeats);
        setBookedSeats(bookedSeats);
      } catch (error) {
        console.error("Không thể tải sơ đồ ghế");
      }
    };

    if (tripDetails?.bus?.id) {
      getSeatLayout();
    }
  }, [tripDetails?.bus?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    setCustomerInfo((prev) => ({ ...prev, paymentMethod: e.target.value }));
  };
  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email) {
      handleOpenSnackBar("Vui lòng điền đầy đủ thông tin khách hàng", "error");
      return;
    }

    if (selectedSeats.length === 0) {
      handleOpenSnackBar("Vui lòng chọn ít nhất một ghế", "error");
      return;
    }

    const invoiceData = {
      id: tripDetails.id,
      email: customerInfo.email,
      name: customerInfo.name,
      number_of_tickets: selectedSeats.length,
      payment_method: customerInfo.paymentMethod,
      phone: customerInfo.phone,
      idbustrip: tripDetails.bus.id,
      listidseatposition: selectedSeats,
    };

    try {
      const response = await createInvoice(invoiceData);
      if (response === 1000) {
        handleOpenSnackBar("Tạo hóa đơn thành công!", "infor");
      }
      if (customerInfo.paymentMethod === "1") {
        const totalAmount = tripDetails.price * selectedSeats.length;
        const invoiceCode = response.result;
        console.log(invoiceCode)
        navigate("/checkout", {
          state: {
            tripDetails,
            selectedSeats,
            customerInfo,
            totalAmount,
            invoiceCode
          },
        });
      }
      console.log("Invoice response:", response);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn:", error);
      alert("Không thể tạo hóa đơn. Vui lòng thử lại.");
    }
  };

  if (!tripDetails) {
    return <div>Không tìm thấy thông tin chuyến xe.</div>;
  }

  return (
    <div>
      <Header />

      <section className="bg-[#f7f7f7] py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4 mx-3">
                <h2 className="text-xl font-semibold">Chọn ghế</h2>
                <span className="text-sm text-blue-500 cursor-pointer">
                  Thông tin xe
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6 ml-2">
                <div>
                  <h4 className="text-sm font-semibold mb-4 text-center">
                    Tầng trên
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {upperSeats.map((seat) => (
                      <div key={seat} className="flex flex-col items-center">
                        <img
                          src={
                            bookedSeats.includes(seat)
                              ? "/images/seat_disabled.svg"
                              : selectedSeats.includes(seat)
                              ? "/images/seat_selecting.svg"
                              : "/images/seat_active.svg"
                          }
                          alt={seat}
                          className="w-8 h-8 cursor-pointer"
                          onClick={() =>
                            !bookedSeats.includes(seat) &&
                            handleSeatSelection(
                              seat,
                              selectedSeats,
                              setSelectedSeats
                            )
                          }
                        />
                        <span className="text-[13px] mt-1">{seat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-center">
                    Tầng dưới
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {lowerSeats.map((seat) => (
                      <div key={seat} className="flex flex-col items-center">
                        <img
                          src={
                            bookedSeats.includes(seat)
                              ? "/images/seat_disabled.svg"
                              : selectedSeats.includes(seat)
                              ? "/images/seat_selecting.svg"
                              : "/images/seat_active.svg"
                          }
                          alt={seat}
                          className="w-8 h-8 cursor-pointer"
                          onClick={() =>
                            !bookedSeats.includes(seat) &&
                            handleSeatSelection(
                              seat,
                              selectedSeats,
                              setSelectedSeats
                            )
                          }
                        />
                        <span className="text-[13px] mt-1">{seat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ml-6">
                  <h4 className="text-sm font-semibold mb-4">Ghi chú</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span>Đã bán</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 rounded"></div>
                      <span>Còn trống</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-200 rounded"></div>
                      <span>Đang chọn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên *"
                  className="py-2 px-4 border rounded-md w-full"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại *"
                  className="py-2 px-4 border rounded-md w-full"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  className="py-2 px-4 border rounded-md w-full"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                />
                <select
                  name="paymentMethod"
                  className="py-2 px-4 border rounded-md w-full"
                  value={customerInfo.paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <option value="0">Tiền mặt</option>
                  <option value="1">Chuyển khoản</option>
                </select>
              </div>
              <label className="text-sm text-red-500 flex items-center gap-2 leading-tight">
                <input type="checkbox" className="mt-0.5" />
                <span>
                  Chấp nhận{" "}
                  <a href="/" className="underline">
                    điều khoản
                  </a>{" "}
                  đặt vé & chính sách bảo mật thông tin của FUTA Bus Lines
                </span>
              </label>

              <div className="mt-6 text-sm text-gray-600 leading-relaxed">
                <h4 className="text-orange-600 font-semibold text-center mb-2 text-[16px]">
                  ĐIỀU KHOẢN & LƯU Ý
                </h4>
                <p>
                  (*) Quý khách vui lòng có mặt tại bến xuất phát trước ít nhất
                  30 phút giờ xe khởi hành... Gọi tổng đài{" "}
                  <span className="text-orange-500 font-bold">1900 6067</span>{" "}
                  để hỗ trợ.
                </p>
                <p className="mt-2">
                  (*) Có nhu cầu trung chuyển, gọi{" "}
                  <span className="text-orange-500 font-bold">1900 6918</span>{" "}
                  trước khi đặt vé.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Thông tin lượt đi</h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Tuyến xe</span>
                  <span className="font-medium">
                    {tripDetails.busRoute.busStationFrom.name} -{" "}
                    {tripDetails.busRoute.busStationTo.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Thời gian xuất bến</span>
                  <span className="font-medium">
                    {new Date(tripDetails.departureTime).toLocaleString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số lượng ghế</span>
                  <span className="font-medium">
                    {selectedSeats.length} Ghế
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số ghế</span>
                  <span className="font-medium">
                    {selectedSeats.join(", ") || "-"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm trả khách</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Tổng tiền lượt đi</span>
                  <span className="text-[16px]">
                    {(tripDetails.price * selectedSeats.length).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Chi tiết giá</h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Giá vé lượt đi</span>
                  <span className="text-red-500 font-medium text-[16px]">
                    {(tripDetails.price * selectedSeats.length).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phí thanh toán</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between font-bold text-red-500">
                  <span>Tổng tiền</span>
                  <span className="text-[16px]">
                    {(tripDetails.price * selectedSeats.length).toLocaleString(
                      "vi-VN"
                    )}
                    đ
                  </span>
                </div>
              </div>
            </div>

            <button
              className="bg-orange-500 text-white px-6 py-3 font-semibold hover:bg-orange-600 transition duration-200"
              style={{ borderRadius: "0.75rem" }}
              disabled={selectedSeats.length === 0}
              onClick={handlePayment}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </section>

      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  );
};

export default SeatSelectionPage;
