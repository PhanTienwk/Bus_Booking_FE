import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const TicketPage = () => {
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
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B07"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B07</span>
                    </div>
                    <div></div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B08"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B08</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-4 text-center">
                    Tầng dưới
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B07"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B07</span>
                    </div>
                    <div></div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B08"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B08</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/seat_active.svg"
                        alt="B04"
                        className="w-8 h-8"
                      />
                      <span className="text-[13px] mt-1">B04</span>
                    </div>
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
                  placeholder="Họ và tên *"
                  className="py-2 px-4 border rounded-md w-full"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại *"
                  className="py-2 px-4 border rounded-md w-full"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  className="py-2 px-4 border rounded-md w-full"
                />
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
                  <span className="font-medium">Mien Tay - Da Lat</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Thời gian xuất bến</span>
                  <span className="font-medium">23:15 06/07/2025</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số lượng ghế</span>
                  <span className="font-medium">2 Ghế</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số ghế</span>
                  <span className="font-medium">B08, B11</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm trả khách</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Tổng tiền lượt đi</span>
                  <span className="text-[16px]">580.000đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Chi tiết giá</h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Giá vé lượt đi</span>
                  <span className="text-red-500 font-medium text-[16px]">580.000đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phí thanh toán</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between font-bold text-red-500">
                  <span>Tổng tiền</span>
                  <span className="text-[16px]">580.000đ</span>
                </div>
              </div>
            </div>

            <button
              className="bg-orange-500 text-white px-6 py-3 font-semibold hover:bg-orange-600 transition duration-200"
              style={{ borderRadius: "0.75rem" }}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TicketPage;
