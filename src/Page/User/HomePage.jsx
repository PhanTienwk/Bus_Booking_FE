import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const HomePage = () => {
  
  return (
    <div>
      <Header />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/home_background.png"
            alt="Banner"
            className="rounded-xl shadow-lg mt-6 w-full"
          />
        </div>
      </section>

      <section className="bg-white relative">
        <div className="max-w-6xl mx-auto mt-6 mb-3 rounded-xl border-[8px] border-[#AA2E081A] shadow-sm">
          <div className="rounded-[0.4rem] border border-[#EF5222]">
            <div className="flex justify-between items-center mb-4 pt-6 md:px-8">
              <div className="flex gap-6 text-base text-[#EF5222]">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    defaultChecked
                    className="accent-[#EF5222]"
                  />
                  Một chiều
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    className="accent-[#EF5222]"
                  />
                  Khứ hồi
                </label>
              </div>
              <a href="/" className="text-base text-[#EF5222]">
                Hướng dẫn mua vé
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 py-4 md:px-8 mb-[35px]">
              <input
                type="text"
                placeholder="Điểm đi"
                className="p-3 rounded-lg border w-full"
              />
              <input
                type="text"
                placeholder="Điểm đến"
                className="p-3 rounded-lg border w-full"
              />
              <input type="date" className="p-3 rounded-lg border w-full" />
              <select className="p-3 rounded-lg border w-full">
                <option value="1">1 vé</option>
                <option value="2">2 vé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] z-10">
          <button className="bg-[#EF5222] text-white px-[77px] py-3 rounded-full font-semibold hover:brightness-105 shadow-lg">
            Tìm chuyến xe
          </button>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
            FUTA BUS LINES – CHẤT LƯỢNG LÀ DANH DỰ
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Được khách hàng tin tưởng và lựa chọn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <img
                src="/images/icon-khach.png"
                alt="Lượt khách"
                className="w-20 h-20 mb-4"
              />
              <h3 className="text-xl font-bold text-[#000]">Hơn 40 Triệu</h3>
              <p className="font-semibold text-gray-700 mb-1">Lượt khách</p>
              <p className="text-gray-600 text-sm">
                Phương Trang phục vụ hơn 40 triệu lượt khách bình quân 1 năm
                trên toàn quốc
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/images/icon-phongve.png"
                alt="Phòng vé"
                className="w-20 h-20 mb-4"
              />
              <h3 className="text-xl font-bold text-[#000]">Hơn 350</h3>
              <p className="font-semibold text-gray-700 mb-1">
                Phòng vé - Bưu cục
              </p>
              <p className="text-gray-600 text-sm">
                Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,...
                trên toàn hệ thống
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/images/icon-chuyenxe.png"
                alt="Chuyến xe"
                className="w-20 h-20 mb-4"
              />
              <h3 className="text-xl font-bold text-[#000]">Hơn 6,500</h3>
              <p className="font-semibold text-gray-700 mb-1">Chuyến xe</p>
              <p className="text-gray-600 text-sm">
                Phương Trang phục vụ hơn 6,500 chuyến xe đường dài và liên tỉnh
                mỗi ngày
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FFF7F5] py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
            TUYẾN PHỔ BIẾN
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Được khách hàng tin tưởng và lựa chọn
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow overflow-hidden border">
              <div className="relative h-40">
                <img
                  src="/images/tphcm.png"
                  alt="TP. Hồ Chí Minh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-4 text-white">
                  <p className="text-sm">Tuyến xe từ</p>
                  <p className="text-lg font-semibold">Tp Hồ Chí Minh</p>
                </div>
              </div>
              <div className="p-4 space-y-4 text-[#00552E] font-medium">
                <div className="flex justify-between">
                  <p>Đà Lạt</p>
                  <p className="text-black">290.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  305km - 8 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>Cần Thơ</p>
                  <p className="text-black">165.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  166km - 5 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>Long Xuyên</p>
                  <p className="text-black">200.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  203km - 5 giờ - 05/07/2025
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border">
              <div className="relative h-40">
                <img
                  src="/images/dalat.png"
                  alt="Đà Lạt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-4 text-white">
                  <p className="text-sm">Tuyến xe từ</p>
                  <p className="text-lg font-semibold">Đà Lạt</p>
                </div>
              </div>
              <div className="p-4 space-y-4 text-[#00552E] font-medium">
                <div className="flex justify-between">
                  <p>TP. Hồ Chí Minh</p>
                  <p className="text-black">290.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  310km - 8 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>Đà Nẵng</p>
                  <p className="text-black">430.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  757km - 17 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>Cần Thơ</p>
                  <p className="text-black">445.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  457km - 11 giờ - 05/07/2025
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border">
              <div className="relative h-40">
                <img
                  src="/images/danang.png"
                  alt="Đà Nẵng"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-4 text-white">
                  <p className="text-sm">Tuyến xe từ</p>
                  <p className="text-lg font-semibold">Đà Nẵng</p>
                </div>
              </div>
              <div className="p-4 space-y-4 text-[#00552E] font-medium">
                <div className="flex justify-between">
                  <p>Đà Lạt</p>
                  <p className="text-black">430.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  666km - 17 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>BX An Sương</p>
                  <p className="text-black">490.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  966km - 20 giờ - 05/07/2025
                </p>

                <div className="flex justify-between">
                  <p>Nha Trang</p>
                  <p className="text-black">370.000đ</p>
                </div>
                <p className="text-sm text-gray-600">
                  528km - 9 giờ 25 phút - 05/07/2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
            KẾT NỐI FUTA GROUP
          </h2>
          <p className="text-gray-600 mb-8">
            Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe
            Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng,...
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
              <div className="flex flex-col items-center">
                <img
                  src="/images/icon-hopdong.png"
                  alt="Xe Hợp Đồng"
                  className="w-23 h-23"
                />
                <p className="mt-3 text-gray-700 font-medium">Xe Hợp Đồng</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/icon-phuongtrang.png"
                  alt="Mua vé Phương Trang"
                  className="w-23 h-23"
                />
                <p className="mt-3 text-gray-700 font-medium">
                  Mua vé Phương Trang
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/icon-giaohang.png"
                  alt="Giao Hàng"
                  className="w-23 h-23"
                />
                <p className="mt-3 text-gray-700 font-medium">Giao Hàng</p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src="/images/icon-xebuyt.png"
                  alt="Xe Buýt"
                  className="w-23 h-23"
                />
                <p className="mt-3 text-gray-700 font-medium">Xe Buýt</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
