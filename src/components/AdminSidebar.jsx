const menuItems = [
  { icon: "/images/admin_image/user.png", label: "Quản lý Người Dùng" },
  { icon: "/images/admin_image/driver.png", label: "Quản lý Tài Xế" },
  { icon: "/images/admin_image/order.png", label: "Quản Lý Hóa Đơn" },
  { icon: "/images/admin_image/cancel.png", label: "Quản Lý Hủy vé" },
  { icon: "/images/admin_image/route.png", label: "Quản Lý Tuyến Xe" },
  { icon: "/images/admin_image/map.png", label: "Quản Lý Chuyến Xe" },
  { icon: "/images/admin_image/bus-station.png", label: "Quản Lý Bến Xe" },
  { icon: "/images/admin_image/bus-bus.png", label: "Quản Lý Xe" },
  { icon: "/images/admin_image/buildings.png", label: "Quản Lý địa điểm" },
  { icon: "/images/admin_image/bill.png", label: "Thống Kê" },
  { icon: "/images/admin_image/profile.png", label: "Thông tin tài khoản" },
];

const AdminSidebar = ({ activeIndex, setActiveIndex }) => {
  const handleLogout = () => {
    console.log("Đăng xuất");
  };

  return (
    <div className="w-64 bg-white h-screen shadow-sm border-r px-4 py-6 fixed flex flex-col justify-between">
      <div>
        <div className="flex justify-center mb-8">
          <img src="/images/logo.png" alt="FUTA Bus Lines" className="h-14" />
        </div>

        <ul className="space-y-3 text-sm font-medium">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition ${
                activeIndex === index
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <img
                src={item.icon}
                alt=""
                className={`w-5 h-5 ${
                  activeIndex !== index ? "opacity-70" : ""
                }`}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="w-full text-white py-2 rounded-lg font-semibold transition hover:opacity-90"
        style={{ backgroundColor: "#ef5222" }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default AdminSidebar;
