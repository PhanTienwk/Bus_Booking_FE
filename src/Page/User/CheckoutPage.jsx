import Header from "../../components/Header";
import Footer from "../../components/Footer";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  markInvoiceAsPaid,
  markInvoiceAsExpired,
} from "../../services/InvoiceService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [qrUrl, setQrUrl] = useState("");

  const location = useLocation();
  const {
    customerInfo,
    tripDetails,
    selectedSeats,
    returnTrip,
    selectedSeatsReturn,
    busId,
    totalAmount,
    invoiceCode,
    invoiceCodeReturn,
  } = location.state || {};

  const [countdown, setCountdown] = useState(10 * 60);
  const [hasPaid, setHasPaid] = useState(false);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const EXPIRE_SECONDS = 10 * 60;

    const savedStartTime = sessionStorage.getItem("paymentStartTime");
    const now = Math.floor(Date.now() / 1000);

    let startTime;
    if (savedStartTime) {
      startTime = parseInt(savedStartTime);
    } else {
      startTime = now;
      sessionStorage.setItem("paymentStartTime", startTime);
    }

    const elapsed = now - startTime;
    const remaining = Math.max(EXPIRE_SECONDS - elapsed, 0);

    setCountdown(remaining);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown <= 0 && !hasPaid && !hasExpired) {
      setHasExpired(true);

      console.log("=== HẾT THỜI GIAN, CHUẨN BỊ GỌI API HẾT HẠN ===");
      console.log("invoiceCode:", invoiceCode);
      console.log("selectedSeats:", selectedSeats);
      console.log("busId:", busId);

      markInvoiceAsExpired(invoiceCode, selectedSeats, busId)
        .then((res) => {
          console.log("API hết hạn lượt đi thành công:", res);

          if (invoiceCodeReturn && selectedSeatsReturn && returnTrip?.bus?.id) {
            console.log("Có dữ liệu lượt về, gọi API hết hạn lượt về:");
            console.log("invoiceCodeReturn:", invoiceCodeReturn);
            console.log("selectedSeatsReturn:", selectedSeatsReturn);
            console.log("returnTrip.bus.id:", returnTrip.bus.id);

            return markInvoiceAsExpired(
              invoiceCodeReturn,
              selectedSeatsReturn,
              returnTrip.bus.id
            );
          } else {
            console.log("Không có dữ liệu lượt về, bỏ qua API lượt về");
          }
        })
        .then((res2) => {
          console.log("API hết hạn lượt về thành công:", res2);
          sessionStorage.removeItem("paymentStartTime");
          navigate("/user");
        })
        .catch((error) => {
          console.error("Lỗi cập nhật trạng thái hóa đơn hết hạn:", error);
        });
    }
  }, [
    countdown,
    hasPaid,
    hasExpired,
    invoiceCode,
    invoiceCodeReturn,
    selectedSeats,
    selectedSeatsReturn,
    returnTrip,
    busId,
    navigate,
  ]);

  useEffect(() => {
    const BANK_ID = "MBBank";
    const ACCOUNT_NO = "0916430832";
    const AMOUNT = totalAmount / 10;
    const DESCRIPTION = `Thanh toan hoa don ${invoiceCode}`;
    console.log("DESCRIPTION: ", DESCRIPTION);

    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}`;
    setQrUrl(qrUrl);

    let interval;
    let hasPaid = false;

    const checkPayment = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbwAoy7Ry4dRnRhIQiJ8Z6hoqMPvtYkzIJmU6yEyJWqP-GxqSusmbKHA3Sfeg5A_sRd7/exec"
        );
        const resJson = await res.json();
        const data = resJson.data;

        const matched = data
          .slice(0, 2)
          .find(
            (item) =>
              parseInt(item["Giá trị"]) <= AMOUNT &&
              item["Mô tả"]?.includes(DESCRIPTION)
          );

        if (matched && !hasPaid) {
          setHasPaid(true);
          clearInterval(interval);

          markInvoiceAsPaid(invoiceCode)
            .then(() => {
              if (invoiceCodeReturn) {
                return markInvoiceAsPaid(invoiceCodeReturn);
              }
            })
            .then(() => {
              navigate("/thankyou", {
                state: {
                  tripDetails,
                  selectedSeats,
                  returnTrip,
                  selectedSeatsReturn,
                  customerInfo,
                  invoiceCode,
                  totalAmount,
                },
              });
            })
            .catch((error) => {
              console.error("Lỗi cập nhật trạng thái hóa đơn:", error);
            });
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thanh toán:", error);
      }
    };

    interval = setInterval(checkPayment, 5000);
    return () => clearInterval(interval);
  }, [
    totalAmount,
    customerInfo,
    invoiceCode,
    invoiceCodeReturn,
    tripDetails,
    returnTrip,
    selectedSeats,
    selectedSeatsReturn,
    navigate,
  ]);

  return (
    <div>
      <Header />

      <section className="bg-[#f7f7f7] py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Chọn phương thức thanh toán
            </h3>
            <div className="flex flex-col gap-4 text-sm">
              {[
                {
                  name: "Thanh toán MB Bank",
                  img: "/images/mbbank-logo.png",
                  selected: true,
                },
              ].map((method, idx) => (
                <label key={idx} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked={method.selected}
                  />
                  <img src={method.img} alt={method.name} className="w-8 h-8" />
                  <span>{method.name}</span>
                  {method.note && (
                    <span className="text-xs text-red-500">{method.note}</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              Tổng thanh toán
            </h2>
            <div className="text-3xl font-bold text-orange-600 mb-4">
              {totalAmount?.toLocaleString("vi-VN")}đ
            </div>
            <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm text-gray-600">
              Thời gian giữ chỗ còn lại:{" "}
              <span className="font-medium">
                {`${String(Math.floor(countdown / 60)).padStart(
                  2,
                  "0"
                )}:${String(countdown % 60).padStart(2, "0")}`}
              </span>
            </div>
            {qrUrl ? (
              <img src={qrUrl} alt="QR thanh toán" className="w-48 h-48 mb-4" />
            ) : (
              <div className="w-48 h-48 mb-4 flex items-center justify-center bg-gray-100 text-sm text-gray-500 rounded-lg">
                Đang tạo mã QR...
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 w-full">
              <p className="font-semibold mb-2">
                Hướng dẫn thanh toán bằng FUTAPay
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Mở ứng dụng FUTAPay trên điện thoại</li>
                <li>Dùng biểu tượng 🔍 để quét mã QR</li>
                <li>Quét mã ở trang này và thanh toán</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-[20px] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Thông tin hành khách
              </h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-1">
                  <span>Họ và tên</span>
                  <span className="font-medium">
                    {customerInfo?.name || "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Số điện thoại</span>
                  <span className="font-medium">
                    {customerInfo?.phone || "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Email</span>
                  <span className="font-medium">
                    {customerInfo?.email || "Chưa có"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-[20px] rounded-xl shadow-sm">
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
                    {tripDetails?.departureTime
                      ? new Date(tripDetails.departureTime).toLocaleString(
                          "vi-VN"
                        )
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số lượng ghế</span>
                  <span className="font-medium">
                    {selectedSeats?.length || 0} Ghế
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số ghế</span>
                  <span className="font-medium">
                    {selectedSeats?.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm lên xe</span>
                  <span className="font-medium">
                    {tripDetails.busRoute.busStationFrom.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Thời gian tới điểm lên xe</span>
                  <span className="font-medium">
                    {tripDetails?.departureTime
                      ? "Trước " +
                        new Date(
                          new Date(tripDetails.departureTime).getTime() -
                            15 * 60000
                        ).toLocaleString("vi-VN")
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm trả khách</span>
                  <span className="font-medium">
                    {tripDetails.busRoute.busStationTo.name}
                  </span>
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

            {returnTrip && (
              <div className="bg-white p-[20px] rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin lượt về
                </h3>
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between mb-2">
                    <span>Tuyến xe</span>
                    <span className="font-medium">
                      {returnTrip.busRoute.busStationFrom.name} -{" "}
                      {returnTrip.busRoute.busStationTo.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Thời gian xuất bến</span>
                    <span className="font-medium">
                      {returnTrip?.departureTime
                        ? new Date(returnTrip.departureTime).toLocaleString(
                            "vi-VN"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Số lượng ghế</span>
                    <span className="font-medium">
                      {selectedSeatsReturn?.length || 0} Ghế
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Số ghế</span>
                    <span className="font-medium">
                      {selectedSeatsReturn?.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Điểm lên xe</span>
                    <span className="font-medium">
                      {returnTrip.busRoute.busStationFrom.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Thời gian tới điểm lên xe</span>
                    <span className="font-medium">
                      {returnTrip?.departureTime
                        ? "Trước " +
                          new Date(
                            new Date(returnTrip.departureTime).getTime() -
                              15 * 60000
                          ).toLocaleString("vi-VN")
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Điểm trả khách</span>
                    <span className="font-medium">
                      {returnTrip.busRoute.busStationTo.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Tổng tiền lượt về</span>
                    <span className="text-[16px]">
                      {(
                        returnTrip.price * selectedSeatsReturn.length
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white p-[20px] rounded-xl shadow-sm">
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
                {returnTrip && (
                  <div className="flex justify-between mb-2">
                    <span>Giá vé lượt về</span>
                    <span className="text-red-500 font-medium text-[16px]">
                      {(
                        returnTrip.price * selectedSeatsReturn.length
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-red-500">
                  <span>Tổng tiền</span>
                  <span className="text-[16px]">
                    {(
                      tripDetails.price * selectedSeats.length +
                      (returnTrip
                        ? returnTrip.price * selectedSeatsReturn.length
                        : 0)
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
