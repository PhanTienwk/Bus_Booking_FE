import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Header />

      <section className="bg-white mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="mt-6 rounded-xl border-[8px] border-[#AA2E081A] shadow-sm bg-white">
            <div className="rounded-lg border border-[#EF5222] p-6">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center">
                  <img
                    src="/images/signin.png"
                    alt="Xe buýt"
                    className="w-full object-contain"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                  <h2 className="text-2xl font-semibold text-center mb-6">
                    {isLogin ? "Đăng nhập tài khoản" : "Tạo tài khoản mới"}
                  </h2>

                  <div className="flex border-b border-orange-300 mb-6">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`w-1/2 px-4 py-2 text-center font-medium border-b-2 transition-all duration-200 ${
                        isLogin
                          ? "text-[#EF5222] border-[#EF5222]"
                          : "text-gray-500 border-transparent"
                      }`}
                    >
                      ĐĂNG NHẬP
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`w-1/2 px-4 py-2 text-center font-medium border-b-2 transition-all duration-200 ${
                        !isLogin
                          ? "text-[#EF5222] border-[#EF5222]"
                          : "text-gray-500 border-transparent"
                      }`}
                    >
                      ĐĂNG KÝ
                    </button>
                  </div>

                  {isLogin ? (
                    <form className="space-y-4">
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/email.png"
                          alt="Phone"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type="text"
                          placeholder="Email"
                          className="bg-transparent outline-none w-full"
                        />
                      </div>

                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/password.svg"
                          alt="Phone"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mật khẩu"
                          className="bg-transparent outline-none w-full"
                        />
                        <img
                          src={showPassword ? "/images/eye.png" : "/images/hide.png"}
                          alt="Toggle Password"
                          className="w-4 h-4 mr-2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>

                      <button className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90">
                        Đăng nhập
                      </button>
                    </form>
                  ) : (
                    <form className="space-y-4">
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/email.png"
                          alt="Email"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type="text"
                          placeholder="Nhập email để đăng ký"
                          className="bg-transparent outline-none w-full"
                        />
                      </div>

                      <button className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90">
                        Đăng ký
                      </button>
                    </form>
                  )}

                  <div className="text-left mt-4 flex items-center gap-2">
                    <a href="/" className="text-[#EF5222] text-sm">
                      Quên mật khẩu?
                    </a>
                    <img
                      src="/images/google.png"
                      alt="Google"
                      className="w-5 h-5 ml-1"
                    />
                  </div>
                </div>
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

export default LoginPage;
