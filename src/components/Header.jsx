import React, { useState, useEffect } from "react";
import { Dropdown, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Để điều hướng
import { getUserInfor } from "../services/UserService";
import "./Header2.css";
const HomePage = () => {
  const [avatar, setAvatar] = useState("/images/avatar.jpg");
  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "1",
    birthDate: "",
    phone: "",
    email: "",
    cccd: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfor(); // Gọi API

        if (response?.code === 1000) {
          const result = response.result;
          setUserInfo({
            name: result.name || "",
            gender: String(result.gender || "1"),
            birthDate: result.birthDate || "",
            phone: result.phone || "",
            email: result.email || "",
            cccd: result.cccd || "",
            avatar: result.avatar || "",
          });
          setAvatar(result.avatar || "/images/avatar.jpg");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  const navigate = useNavigate(); // Để điều hướng

  // Định nghĩa mảng items cho Dropdown
  const items = [
    {
      key: "1",
      label: "Tài khoản của tôi",
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Hồ sơ",

      onClick: () => handleNavigateProfile(),
    },
    {
      key: "3",
      label: "Hóa đơn",
      // extra: "⌘B",
    },
    {
      key: "4",
      label: (
        <span className="sign-out-container">
          <i className="fas fa-sign-out-alt"></i> Đăng xuất
        </span>
      ),

      onClick: () => handleLogOut(),
    },
  ];

  // Hàm điều hướng (tùy chỉnh theo nhu cầu)
  const handleNavigateProfile = () => {
    navigate("/profile");
  };

  const handleLogOut = () => {
    // Clear localStorage or sessionStorage (e.g., remove token)
    localStorage.removeItem("token"); // Adjust key name based on your app
    sessionStorage.removeItem("token"); // If using sessionStorage

    // Reset userInfo state
    setUserInfo({
      name: "",
      gender: "1",
      birthDate: "",
      phone: "",
      email: "",
      cccd: "",
      avatar: "",
    });

    // Reset avatar state
    setAvatar("/images/avatar.jpg");

    // Redirect to login page
    navigate("/login");
  };

  // Component UserDropdown
  const UserDropdown = () => (
    <Dropdown
      menu={{
        items, // Sử dụng mảng items đã định nghĩa
      }}
    >
      <a href="/" onClick={(e) => e.preventDefault()}>
        <Space>
          <img
            className="image-user-infor"
            src={avatar}
            alt="Ảnh đại diện"
            width="35"
            height="35"
            style={{ position: "relative", bottom: "-3px" }}
          />
          <DownOutlined />
          {userInfo.name}
        </Space>
      </a>
    </Dropdown>
  );

  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <div className="bg-white">
      <header className="bg-[#2474e5] py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/vietnam.svg" alt="Cờ VN" className="w-5 h-5" />
            <span className="text-white font-medium">VI</span>
            <span className="text-white">|</span>
            <a href="/" className="text-white hover:underline">
              Tải ứng dụng
            </a>
          </div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-6 text-white font-semibold">
              <a href="/" className="border-b-2 border-white pb-1">
                Trang chủ
              </a>
              <a href="/">Lịch trình</a>
              <a href="/consult-ticket">Tra cứu vé</a>
              <a href="/">Tin tức</a>
              <a href="/consult-invoice">Hóa đơn</a>
              <a href="/">Liên hệ</a>
              <a href="/">Về chúng tôi</a>
            </nav>
            {isLoggedIn ? (
              <button className="flex items-center gap-2 text-white bg-white bg-opacity-20 px-4 rounded-full">
                <UserDropdown />
              </button>
            ) : (
              <button
                className="flex items-center gap-2 text-white bg-white bg-opacity-20 px-4 rounded-full"
                onClick={() => handleLogOut()}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.086 0 4.053.496 5.879 1.379M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <div>Đăng nhập/Đăng ký </div>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
