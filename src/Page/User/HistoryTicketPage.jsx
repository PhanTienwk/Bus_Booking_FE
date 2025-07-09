import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const HistoryTicketPage = () => {
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
            <button className="flex items-center gap-2 text-orange-600 font-semibold bg-[#FFF3E0] hover:bg-[#FFE0B2] px-4 py-2 rounded-lg transition">
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  Lịch sử mua vé
                </h2>
                <p className="text-sm text-gray-500">
                  Theo dõi và quản lý quá trình lịch sử mua vé của bạn
                </p>
              </div>
              <button className="bg-[#4CAF50] text-white px-6 py-2 rounded-full font-medium hover:bg-[#388E3C] transition">
                Đặt vé
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-6">
              <div className="md:col-span-4">
                <label className="block text-sm text-gray-600 mb-1">
                  Tuyến đường
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1"
                  placeholder="Nhập tuyến đường"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Thời gian
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-1"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm text-gray-600 mb-1">
                  Trạng thái
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-1">
                  <option>Tất cả</option>
                  <option>Đã đặt</option>
                  <option>Hoàn tất</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button className="bg-gray-200 text-black w-full py-1 rounded-lg font-medium hover:bg-gray-300 transition">
                  Tìm
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border">Tuyến đường</th>
                    <th className="py-2 px-4 border">Ngày đi</th>
                    <th className="py-2 px-4 border">Số vé</th>
                    <th className="py-2 px-4 border">Số tiền</th>
                    <th className="py-2 px-4 border">Trạng thái</th>
                    <th className="py-2 px-4 border">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  <tr>
                    <td className="py-2 px-4 border">Mỹ Đình - Miền Đông</td>
                    <td className="py-2 px-4 border">12:00 20/6/2025</td>
                    <td className="py-2 px-4 border">1</td>
                    <td className="py-2 px-4 border">500.000 đ</td>
                    <td className="py-2 px-4 border">Đã đặt</td>
                    <td className="py-2 px-4 border">
                      <button className="bg-orange-400 text-white px-4 py-1 rounded-lg hover:bg-orange-500 transition">
                        Hủy
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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

export default HistoryTicketPage;
