import React, { useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { login, register, verifyOTP, completeRegistration} from "../../services/auth"; 
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const [registerEmail, setRegisterEmail] = useState("");
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completeData, setCompleteData] = useState({
    name: "",
    cccd: "",
    phone: "",
    gender: "",
    birthDate: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterEmail(e.target.value);
  };

  const handleCompleteChange = (e) => {
    setCompleteData({ ...completeData, [e.target.name]: e.target.value });
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    }
  };

  const handleOTPKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email: credentials.email, password: credentials.password }); 
      const role = localStorage.getItem("role");
      if (data && data.token) {
        setMessage("Đăng nhập thành công!");
        if (role === "ADMIN") navigate("/admin");
        else if (role === "USER") navigate("/user");
        else if (role === "DRIVER") navigate("/driver");
        else setMessage("Vai trò không xác định, vui lòng liên hệ admin.");
      } else {
        setMessage("Không nhận được token.");
      }
    } catch (error) {
      setMessage(error.message || "Đăng nhập thất bại.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      setMessage("Vui lòng nhập email hợp lệ.");
      return;
    }
    try {
      const data = await register(registerEmail);
      if (data.code === 200) {
        setMessage("Đăng ký thành công! Vui lòng kiểm tra email của bạn.");
        setShowOTPForm(true);
      } else {
        setMessage("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage(error.message || "Không thể kết nối đến server.");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setMessage("Vui lòng nhập đủ 6 chữ số OTP.");
      return;
    }
    try {
      const data = await verifyOTP({ email: registerEmail, otp: otpCode });
      if (data.code === 200) {
        setMessage("Xác thực OTP thành công! Vui lòng hoàn tất thông tin đăng ký.");
        setShowOTPForm(false);
        setShowCompleteForm(true);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setMessage("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage(error.message || "Không thể xác thực OTP.");
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    const { name, cccd, phone, gender, birthDate, password } = completeData;
    if (!name || !cccd || !phone || !gender || !birthDate || !password) {
      setMessage("Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }
    if (!/^\d{12}$/.test(cccd)) {
      setMessage("CCCD phải gồm 12 chữ số.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setMessage("Số điện thoại phải gồm 10 chữ số.");
      return;
    }

    const requestData = {
    email: registerEmail,
    ...completeData,
    };

    // In ra request gửi đến backend
    console.log("Request gửi đến backend (/api/complete-registration):", JSON.stringify(requestData, null, 2));
    try {
      const response = await completeRegistration({
        email: registerEmail,
        ...completeData,
      });
      if (response.code === 200) {
        setMessage("Hoàn tất đăng ký thành công! Vui lòng đăng nhập.");
        setShowCompleteForm(false);
        setRegisterEmail("");
        setCompleteData({ name: "", cccd: "", phone: "", gender: "", birthDate: "", password: "" });
        setIsLogin(true);
      } else {
        setMessage("Hoàn tất đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Không thể kết nối đến server.");
    }
  };

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
                    {isLogin
                      ? "Đăng nhập tài khoản"
                      : showOTPForm
                      ? "Nhập mã OTP"
                      : showCompleteForm
                      ? "Hoàn tất đăng ký"
                      : "Tạo tài khoản mới"}
                  </h2>

                  <div className="flex border-b border-orange-300 mb-6">
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setShowOTPForm(false);
                        setShowCompleteForm(false);
                      }}
                      className={`w-1/2 px-4 py-2 text-center font-medium border-b-2 transition-all duration-200 ${
                        isLogin
                          ? "text-[#EF5222] border-[#EF5222]"
                          : "text-gray-500 border-transparent"
                      }`}
                    >
                      ĐĂNG NHẬP
                    </button>
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setShowOTPForm(false);
                        setShowCompleteForm(false);
                      }}
                      className={`w-1/2 px-4 py-2 text-center font-medium border-b-2 transition-all duration-200 ${
                        !isLogin && !showOTPForm && !showCompleteForm
                          ? "text-[#EF5222] border-[#EF5222]"
                          : "text-gray-500 border-transparent"
                      }`}
                    >
                      ĐĂNG KÝ
                    </button>
                  </div>

                  {isLogin ? (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/email.png"
                          alt="Email"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          value={credentials.email}
                          onChange={handleChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Email address"
                        />
                      </div>

                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/password.svg"
                          alt="Password"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Mật khẩu"
                          value={credentials.password}
                          onChange={handleChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Password"
                        />
                        <img
                          src={showPassword ? "/images/eye.png" : "/images/hide.png"}
                          alt="Toggle Password"
                          className="w-4 h-4 mr-2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90"
                      >
                        Đăng nhập
                      </button>
                      {message && <p className="text-center text-red-500">{message}</p>}
                    </form>
                  ) : showOTPForm ? (
                    <form className="space-y-4" onSubmit={handleOTPSubmit}>
                      <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOTPChange(e, index)}
                            onKeyDown={(e) => handleOTPKeyDown(e, index)}
                            ref={(el) => (otpInputs.current[index] = el)}
                            className="w-10 h-10 text-center border rounded-md bg-[#fff7f5] outline-none focus:border-[#EF5222]"
                            aria-label={`OTP digit ${index + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90"
                        disabled={otp.join("").length !== 6}
                      >
                        Xác thực OTP
                      </button>
                      {message && <p className="text-center text-red-500">{message}</p>}
                    </form>
                  ) : showCompleteForm ? (
                    <form className="space-y-4" onSubmit={handleCompleteSubmit}>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <input
                          type="text"
                          name="name"
                          placeholder="Tên"
                          value={completeData.name}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Full name"
                        />
                      </div>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <input
                          type="text"
                          name="cccd"
                          placeholder="CCCD"
                          value={completeData.cccd}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Citizen ID"
                        />
                      </div>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Điện thoại"
                          value={completeData.phone}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Phone number"
                        />
                      </div>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <select
                          name="gender"
                          value={completeData.gender}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Gender"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="1">Nam</option>
                          <option value="2">Nữ</option>
                          <option value="3">Khác</option>
                        </select>
                      </div>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <input
                          type="date"
                          name="birthDate"
                          placeholder="Ngày sinh"
                          value={completeData.birthDate}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Date of birth"
                        />
                      </div>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Mật khẩu"
                          value={completeData.password}
                          onChange={handleCompleteChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Password"
                        />
                        <img
                          src={showPassword ? "/images/eye.png" : "/images/hide.png"}
                          alt="Toggle Password"
                          className="w-4 h-4 mr-2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90"
                      >
                        Hoàn tất đăng ký
                      </button>
                      {message && <p className="text-center text-red-500">{message}</p>}
                    </form>
                  ) : (
                    <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                      <div className="flex items-center border rounded-md px-3 py-2 bg-[#fff7f5]">
                        <img
                          src="/images/email.png"
                          alt="Email"
                          className="w-6 h-6 mr-2"
                        />
                        <input
                          type="text"
                          placeholder="Nhập email để đăng ký"
                          value={registerEmail}
                          onChange={handleRegisterChange}
                          className="bg-transparent outline-none w-full"
                          aria-label="Email for registration"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#EF5222] text-white rounded-full py-2 mt-2 hover:opacity-90"
                      >
                        Đăng ký
                      </button>
                      {message && <p className="text-center text-red-500">{message}</p>}
                    </form>
                  )}

                  <div className="text-left mt-4 flex items-center gap-2">
                    <a href="/forgot-password" className="text-[#EF5222] text-sm">
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