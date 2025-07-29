import Header from "../../components/Header";
import Footer from "../../components/Footer";
import React, { useState, useEffect } from "react";
import {
  getUserInfor,
  updateUserInfor,
  updatePassword,
} from "../../services/UserService";
import {
  getAllInvoices,
  handleGetInvoiceByUserId,
} from "../../services/InvoiceService";
import { Snackbar, Alert } from "@mui/material";
import { Table } from "antd";
const InforUserPage = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Invoices, setInvoice] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: "",
    gender: "1",
    birthDate: "",
    phone: "",
    email: "",
    cccd: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState("/images/avatar.jpg");
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserInfor(); // Gọi API
        const InvoicesRes = await handleGetInvoiceByUserId(
          response.result.phone
        );
        console.log("respon", response);
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
        } else {
          handleOpenSnackBar("Lấy thông tin người dùng thất bại!", "error");
        }

        console.log("invoice", InvoicesRes);
        if (InvoicesRes?.code === 1000) {
          setInvoice(InvoicesRes.result || []);
        } else {
          handleOpenSnackBar("Lấy lịch sử người dùng thất bại!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        handleOpenSnackBar(
          error?.response?.data?.message || "Lỗi khi lấy thông tin người dùng!",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    setShowLogoutConfirm(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setUserInfo({ ...userInfo, avatar: file });
    }
  };
  const handlePasswordSave = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      handleOpenSnackBar("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      handleOpenSnackBar("Mật khẩu mới không khớp!", "error");
      return;
    }

    try {
      const res = await updatePassword({
        currentPassword,
        newPassword,
      });

      if (res.code === 1000) {
        handleOpenSnackBar("Cập nhật mật khẩu thành công!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        handleOpenSnackBar(
          res.message || "Cập nhật mật khẩu thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật mật khẩu:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi cập nhật mật khẩu!",
        "error"
      );
    }
  };

  const handleSave = async () => {
    if (!userInfo.name || userInfo.name.trim() === "") {
      handleOpenSnackBar("Tên không được để trống!", "error");
      return;
    }
    if (!userInfo.birthDate) {
      handleOpenSnackBar("Ngày sinh không được để trống!", "error");
      return;
    }
    if (!/^\d{10}$/.test(userInfo.phone)) {
      handleOpenSnackBar("Số điện thoại phải gồm 10 chữ số!", "error");
      return;
    }
    if (!/^\d{12}$/.test(userInfo.cccd)) {
      handleOpenSnackBar("CCCD phải gồm 12 chữ số!", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", userInfo.name);
      formData.append("gender", userInfo.gender);
      formData.append("birthDate", userInfo.birthDate);
      formData.append("phone", userInfo.phone);
      formData.append("cccd", userInfo.cccd);
      if (userInfo.avatar instanceof File) {
        formData.append("file", userInfo.avatar);
      }
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }
      const updateRes = await updateUserInfor(formData);
      console.log(updateRes);
      if (updateRes.code === 1000) {
        handleOpenSnackBar("Cập nhật thông tin thành công!", "success");
        setIsEditing(false);
      } else {
        handleOpenSnackBar(
          updateRes.message || "Cập nhật thông tin thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      handleOpenSnackBar(
        error?.response?.message || "Lỗi khi cập nhật thông tin!",
        "error"
      );
    }
  };

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const getColumns = () => {
    return [
      {
        title: "Mã Hóa đơn",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Tên khách hàng",
        dataIndex: ["user", "name"],
        key: "userName",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Số điện thoại",
        dataIndex: ["user", "phone"],
        key: "userPhone",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Bến xe đi",
        dataIndex: ["busTrip", "busRoute", "busStationFrom", "name"],
        key: "busStationFrom",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Bến xe đến",
        dataIndex: ["busTrip", "busRoute", "busStationTo", "name"],
        key: "busStationTo",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Số vé",
        dataIndex: "numberOfTickets",
        key: "numberOfTickets",
      },
      {
        title: "Tổng tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (amount) => `${amount.toFixed(2)} VNĐ`,
      },
      {
        title: "Thời gian đặt",
        dataIndex: "timeOfBooking",
        key: "timeOfBooking",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (method) => {
          const methods = {
            5: "Tiền mặt",
            // Thêm các phương thức khác nếu có
          };
          return methods[method] || `Phương thức ${method}`;
        },
      },
      // {
      //   title: "Trạng thái",
      //   key: "status",
      //   render: (_, record) => (
      //     <Switch
      //       checked={record.status === 5} // Giả sử 5 là trạng thái hoạt động
      //       onChange={(checked) => handleToggleStatus(record.id, checked)}
      //     />
      //   ),
      // },
    ];
  };

  const historyticket = () => {
    if (isLoading) {
      return <div className="md:col-span-5">Đang tải...</div>;
    }

    if (activeSection === "account") {
      <Table
        columns={getColumns()}
        dataSource={Invoices}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />;
    }
  };
  const renderSection = () => {
    if (isLoading) {
      return <div className="md:col-span-5">Đang tải...</div>;
    }

    if (activeSection === "account") {
      return (
        <div className="md:col-span-5">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Thông tin tài khoản
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
          <div className="bg-white rounded-xl p-6 border">
            <div className="flex justify-center mb-6 relative">
              <img
                src={avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#ef5222] text-white p-2 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </label>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <label className="block text-gray-500 mb-1">Họ và tên:</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Giới tính:</label>
                <select
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-500"
                  disabled={!isEditing}
                >
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
                  <option value="3">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Ngày sinh:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={userInfo.birthDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={!isEditing}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-500 mb-1">CCCD:</label>
                <input
                  type="text"
                  name="cccd"
                  value={userInfo.cccd}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              {isEditing ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-400 transition"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      );
    } else if (activeSection === "reset-password") {
      return (
        <div className="md:col-span-5">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Đặt lại mật khẩu
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Thay đổi mật khẩu để tăng cường bảo mật tài khoản
          </p>
          <div className="bg-white rounded-xl p-6 border">
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-800">
              <div>
                <label className="block text-gray-500 mb-1">
                  Mật khẩu hiện tại:
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handlePasswordSave}
                className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      );
    } else if (activeSection === "history-ticket") {
      return (
        <div className="md:col-span-5">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Lịch sử vé xe
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Danh sách các hóa đơn đặt vé của bạn
          </p>
          <Table
            columns={getColumns()}
            dataSource={Invoices}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Header />
      <section className="bg-[#f7f7f7] py-6 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-7 gap-8">
          <div className="md:col-span-2 flex flex-col gap-3 bg-white rounded-xl p-6 border">
            <button
              onClick={() => setActiveSection("account")}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                activeSection === "account"
                  ? "text-orange-600 bg-[#FFF3E0] hover:bg-[#FFE0B2]"
                  : "text-gray-600 bg-white hover:text-orange-500"
              }`}
            >
              <img
                src="/images/infor_user.svg"
                className="w-7 h-7"
                alt="Thông tin"
              />
              Thông tin tài khoản
            </button>
            <button
              onClick={() => setActiveSection("reset-password")}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                activeSection === "reset-password"
                  ? "text-orange-600 bg-[#FFF3E0] hover:bg-[#FFE0B2]"
                  : "text-gray-600 bg-white hover:text-orange-500"
              }`}
            >
              <img
                src="/images/change_password.svg"
                className="w-7 h-7"
                alt="Mật khẩu"
              />
              Đặt lại mật khẩu
            </button>

            <button
              onClick={() => setActiveSection("history-ticket")}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                activeSection === "history-ticket"
                  ? "text-orange-600 bg-[#FFF3E0] hover:bg-[#FFE0B2]"
                  : "text-gray-600 bg-white hover:text-orange-500"
              }`}
            >
              <img
                src="/images/history.svg"
                className="w-7 h-7"
                alt="Mật khẩu"
              />
              Lịch sử vé xe
            </button>
          </div>
          {renderSection()}
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
      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
      <Footer />
    </div>
  );
};

export default InforUserPage;
