import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import BusStationManage from "./BusStation";

const AdminLayout = () => {
  const username = "Admin Dũng";
  const [activeIndex, setActiveIndex] = useState(0);

  const renderContent = () => {
    switch (activeIndex) {
      case 5: // Quản Lý Bến Xe
        return <BusStationManage />;
      case 0: // Quản lý Người Dùng (mặc định)
      default:
        return (
          <div className="px-6 pt-6 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Khách hàng</p>
                  <p className="text-2xl font-semibold">11</p>
                </div>
                <img
                  src="/images/customer.png"
                  alt="icon customer"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Tổng số xe</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <img
                  src="/images/bus.png"
                  alt="icon bus"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Số chuyến xe</p>
                  <p className="text-2xl font-semibold">10</p>
                </div>
                <img
                  src="/images/bus-route.png"
                  alt="icon bus-route"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Tổng doanh thu</p>
                  <p className="text-2xl font-semibold">0 đ</p>
                </div>
                <img
                  src="/images/admin_image/money.png"
                  alt="icon money"
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>

            <div className="bg-white shadow rounded px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Danh sách khách hàng
                </h2>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Nhập từ khóa để tìm kiếm..."
                    className="border px-3 py-1 rounded focus:outline-none focus:ring-0 text-sm placeholder:text-sm w-72"
                  />
                  <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-1.5 rounded">
                    Thêm người dùng
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm text-left">
                  <thead className="bg-gray-100 text-center">
                    <tr>
                      <th className="px-4 py-3 text-gray-700">Họ tên</th>
                      <th className="px-4 py-3 text-gray-700">Tuổi</th>
                      <th className="px-4 py-3 text-gray-700">Giới tính</th>
                      <th className="px-4 py-3 text-gray-700">Địa chỉ</th>
                      <th className="px-4 py-3 text-gray-700">Số điện thoại</th>
                      <th className="px-4 py-3 text-gray-700">Email</th>
                      <th className="px-4 py-3 text-gray-700">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {[
                      {
                        name: "Nguyễn Văn An",
                        age: 2001,
                        gender: "Nam",
                        address: "Cà Mau",
                        phone: "0987654322",
                        email: "anvan@gmail.com",
                      },
                      {
                        name: "Nguyễn Thị Bé Hai",
                        age: 2000,
                        gender: "Nữ",
                        address: "Hà Nội",
                        phone: "0123456989",
                        email: "dung@gmail.com",
                      },
                      {
                        name: "Lê Văn Cường",
                        age: 1985,
                        gender: "Nam",
                        address: "Hải Phòng",
                        phone: "0912345678",
                        email: "cuonglv@gmail.com",
                      },
                      {
                        name: "Phạm Thị Hạnh",
                        age: 2000,
                        gender: "Nữ",
                        address: "Cần Thơ",
                        phone: "0934567890",
                        email: "hanhpt@gmail.com",
                      },
                      {
                        name: "Trần Minh Đức",
                        age: 1995,
                        gender: "Nam",
                        address: "Đà Lạt",
                        phone: "0981122334",
                        email: "ductm@gmail.com",
                      },
                    ].map((customer, index) => (
                      <tr key={index} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-4">{customer.name}</td>
                        <td className="px-4 py-4">{customer.age}</td>
                        <td className="px-4 py-4">{customer.gender}</td>
                        <td className="px-4 py-4">{customer.address}</td>
                        <td className="px-4 py-4">{customer.phone}</td>
                        <td className="px-4 py-4">{customer.email}</td>
                        <td className="px-4 py-4 space-x-2">
                          <button>
                            <img
                              src="/images/see.png"
                              alt="Thông tin"
                              className="w-5 h-5 inline-block hover:scale-110 transition-transform duration-200"
                            />
                          </button>
                          <button>
                            <img
                              src="/images/update.png"
                              alt="Chỉnh sửa"
                              className="w-5 h-5 inline-block hover:scale-110 transition-transform duration-200"
                            />
                          </button>
                          <button>
                            <img
                              src="/images/delete.png"
                              alt="Xóa"
                              className="w-5 h-5 inline-block hover:scale-110 transition-transform duration-200"
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">
                  Hiển thị trang 1 trong 3 trang
                </span>
                <div className="space-x-2 text-sm">
                  <button className="px-3 py-1 border rounded-full bg-white text-gray-600">
                    Trước
                  </button>
                  <button className="w-8 h-8 border rounded-full bg-orange-500 text-white">
                    1
                  </button>
                  <button className="w-8 h-8 border rounded-full bg-white text-gray-600">
                    2
                  </button>
                  <button className="w-8 h-8 border rounded-full bg-white text-gray-600">
                    3
                  </button>
                  <button className="px-3 py-1 border rounded-full bg-white text-gray-600">
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
