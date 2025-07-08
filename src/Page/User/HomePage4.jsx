import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const CheckoutPage = () => {

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
                { name: "Thanh toán tiền mặt", img: "/images/money.png" },
                { name: "Thanh toán Momo", img: "/images/agribank.png", selected: true },
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
              290.000đ
            </div>
            <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm text-gray-600">
              Thời gian giữ chỗ còn lại:{" "}
              <span className="font-medium">18 : 34</span>
            </div>
            <img
              src="/images/checkout.png"
              alt="QR Code"
              className="w-48 h-48 mb-4"
            />
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
                  <span className="font-medium">Dũng Nguyễn</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Số điện thoại</span>
                  <span className="font-medium">0916430832</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Email</span>
                  <span className="font-medium">lamdepcungnhau@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-[20px] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">
                Thông tin lượt đi
              </h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Tuyến xe</span>
                  <span className="font-medium">Mien Tay - Da Lat</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Thời gian xuất bến</span>
                  <span className="font-medium">19:30 07/07/2025</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số lượng ghế</span>
                  <span className="font-medium">1 Ghế</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Số ghế</span>
                  <span className="font-medium">B02</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm lên xe</span>
                  <span className="font-medium">BX Miền Tây</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Thời gian tới điểm lên xe</span>
                  <span className="font-medium">Trước 19:15 07/07/2025</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Điểm trả khách</span>
                  <span className="font-medium">DA LAT</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Tổng tiền lượt đi</span>
                  <span className="text-[16px]">290.000đ</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-[20px] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Chi tiết giá</h3>
              <div className="text-sm text-gray-700">
                <div className="flex justify-between mb-2">
                  <span>Giá vé lượt đi</span>
                  <span className="text-red-500 font-medium text-[16px]">290.000đ</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Phí thanh toán</span>
                  <span className="text-[16px]">0đ</span>
                </div>
                <div className="flex justify-between font-bold text-red-500">
                  <span>Tổng tiền</span>
                  <span className="text-[16px]">290.000đ</span>
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
