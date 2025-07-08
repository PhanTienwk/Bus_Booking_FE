import React from "react";

const HomePage = () => {
  return (
    <div className="bg-[#FFF7F5]">
      <footer className="dark:bg-gray-100 dark:text-gray-800">
        <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
          <div className="w-full lg:w-1/3 flex justify-center">
            <a
              rel="noopener noreferrer"
              href="/"
              className="flex space-x-3 items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-violet-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="flex-shrink-0 w-5 h-5 rounded-full text-[#EF5222]"
                >
                  <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
                </svg>
              </div>
              <span className="self-center text-2xl font-semibold text-[#EF5222]">
                FutaBus Booking
              </span>
            </a>
          </div>
          <div className="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase dark:text-gray-900 text-[16px] font-bold text-[#00613D] uppercase">
                FUTA Bus Lines
              </h3>
              <ul className="space-y-1 list-disc list-inside marker:text-gray-400">
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Lịch trình
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Tin tức & Sự kiện
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="tracking-wide uppercase dark:text-gray-900 text-[16px] font-bold text-[#00613D] uppercase">
                Hỗ trợ
              </h3>
              <ul className="space-y-1 list-disc list-inside marker:text-gray-400">
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Tra cứu thông tin đặt vé
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Hướng dẫn đặt vé trên Web
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    Hướng dẫn nạp tiền trên App
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3 w-fit">
              <h3 className="uppercase dark:text-gray-900 text-[16px] font-bold text-[#00613D] uppercase">
                TẢI APP FUTA
              </h3>
              <ul className="space-y-1 list-disc list-inside marker:text-gray-400">
                <li>
                  <a rel="noopener noreferrer" href="/">
                    CH Play
                  </a>
                </li>
                <li>
                  <a rel="noopener noreferrer" href="/">
                    App Store
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="uppercase dark:text-gray-900 text-[16px] font-bold text-[#00613D] uppercase">
                Kết nối chúng tôi
              </div>
              <div className="flex justify-start space-x-3">
                <a
                  rel="noopener noreferrer"
                  href="/"
                  title="Facebook"
                  className="flex items-center p-1"
                >
                  <img src="/images/fb.png" alt="fb" className="h-6 w-6" />
                </a>
                <a
                  rel="noopener noreferrer"
                  href="/"
                  title="Twitter"
                  className="flex items-center p-1"
                >
                  <img src="/images/ytb.png" alt="ytb" className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
            <div className="flex flex-col items-center">
              <img
                src="/images/footer1.png"
                alt="footer1"
                className="h-12 object-contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/footer2.png"
                alt="footer2"
                className="h-12 object-contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/footer3.png"
                alt="footer3"
                className="h-12 object-contain"
              />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/footer4.png"
                alt="footer4"
                className="h-12 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="text-center text-sm mt-8 bg-[#00613D] text-white py-4">
          © 2025 | Đồ án thực tập tốt nghiệp. Thực hiện bởi: Nguyễn Văn Dũng,
          Phan Văn Tiến, Nguyễn Văn Chiến
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
