import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ChangePasswordPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <button className="flex items-center gap-2 text-gray-600 hover:text-orange-500 bg-white px-4 py-2 rounded-lg transition">
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
            <button className="flex items-center gap-2 text-orange-600 font-semibold bg-[#FFF3E0] hover:bg-[#FFE0B2] px-4 py-2 rounded-lg transition">
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
              Đặt lại mật khẩu
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
              khác
            </p>

            <div className="bg-white rounded-xl p-6">
              <form className="max-w-sm mx-auto space-y-4 text-sm text-gray-800">
                <div>
                  <label className="block text-gray-600 mb-1">
                    * Mật khẩu cũ
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      placeholder="Tên đăng nhập hoặc email"
                      autoComplete="username"
                      className="hidden"
                    />
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu cũ"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-orange-300"
                      autoComplete="current-password"
                    />
                    <img
                      src={
                        showOldPassword ? "/images/eye.png" : "/images/hide.png"
                      }
                      alt="Toggle Password"
                      className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">
                    * Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-orange-300"
                      autoComplete="new-password"
                    />
                    <img
                      src={
                        showNewPassword ? "/images/eye.png" : "/images/hide.png"
                      }
                      alt="Toggle Password"
                      className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-600 mb-1">
                    * Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-orange-300"
                      autoComplete="new-password"
                    />
                    <img
                      src={
                        showConfirmPassword
                          ? "/images/eye.png"
                          : "/images/hide.png"
                      }
                      alt="Toggle Password"
                      className="absolute right-3 top-2.5 w-4 h-4 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
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

export default ChangePasswordPage;
