

const menuItems = [
  { icon: "/images/admin_image/user.png", label: "Lịch làm việc" },
  { icon: "/images/admin_image/profile.png", label: "Thông tin tài khoản" },
];

const AdminSidebar = ({ activeIndex, setActiveIndex }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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