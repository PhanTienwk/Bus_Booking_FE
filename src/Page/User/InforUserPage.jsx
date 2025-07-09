import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const InforUserPage = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    setShowLogoutConfirm(false);
  };

  return (
    <div>
      <Header />

      <section className="bg-[#f7f7f7] py-6 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-7 gap-8">
          <div className="md:col-span-2 flex flex-col gap-3 bg-white rounded-xl p-6 border">
            <button className="flex items-center gap-2 text-orange-600 font-semibold bg-[#FFF3E0] hover:bg-[#FFE0B2] px-4 py-2 rounded-lg transition">
              <img
                src="/images/infor_user.svg"
                className="w-7 h-7"
                alt="Thông tin"
              />
              Thông tin tài khoản
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500 bg-white px-4 py-2 rounded-lg transition">
              <img
                src="/images/history.svg"
                className="w-7 h-7"
                alt="Lịch sử"
              />
              Lịch sử mua vé
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500 bg-white px-4 py-2 rounded-lg transition">
              <img
                src="/images/change_password.svg"
                className="w-7 h-7"
                alt="Mật khẩu"
              />
              Đặt lại mật khẩu
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 bg-white px-4 py-2 rounded-lg transition"
            >
              <img
                src="/images/logout.svg"
                className="w-7 h-7"
                alt="Đăng xuất"
              />
              Đăng xuất
            </button>
          </div>

          <div className="md:col-span-5">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Thông tin tài khoản
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>

            <div className="bg-white rounded-xl p-6 border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                <div>
                  <label className="block text-gray-500 mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value="Nguyễn Văn Dũng"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Giới tính:</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                    disabled
                  >
                    <option>Nam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Năm sinh:</label>
                  <input
                    type="text"
                    value="2000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">
                    Số điện thoại:
                  </label>
                  <input
                    type="text"
                    value="0346284956"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-500 mb-1">Email:</label>
                  <input
                    type="email"
                    value="nguyenvandung18052003@gmail.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-500 mb-1">Địa chỉ:</label>
                  <input
                    type="text"
                    value="Lâm Đồng"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <button className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition">
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>

        {showLogoutConfirm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="bg-white rounded-xl p-6 shadow-xl max-w-md text-center transform -translate-y-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Bạn có chắc muốn đăng xuất?
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Nếu bạn đăng xuất, phiên làm việc hiện tại sẽ kết thúc.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-5 py-1 rounded-md border border-gray-300 hover:bg-gray-100 transition font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-1 rounded-md bg-[#6366f1] text-white hover:bg-indigo-600 transition font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default InforUserPage;
