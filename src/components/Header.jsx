import React from "react";

const HomePage = () => {
  return (
    <div className="bg-white">
      <header className="bg-[#EF5222] py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/vietnam.svg" alt="VN Flag" className="w-5 h-5" />
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
              <a href="/">Tra cứu vé</a>
              <a href="/">Tin tức</a>
              <a href="/">Hóa đơn</a>
              <a href="/">Liên hệ</a>
              <a href="/">Về chúng tôi</a>
            </nav>
            <button className="flex items-center gap-2 text-white bg-white bg-opacity-20 px-4 py-2 rounded-full">
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
              Đăng nhập/Đăng ký
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
