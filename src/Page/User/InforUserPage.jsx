import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  getUserInfor,
  updateUserInfor,
  updatePassword,
} from "../../services/UserService";
import { Table, Button, Modal, Input, Select } from "antd";
import { handleGetTicketByUserId } from "../../services/ticketService";
import {
  handleGetInvoiceByUserId,
  handleUpdateInvoiceStatus,
  handleAddBankDT,
  handleGetBankList,
} from "../../services/InvoiceService";
import { Snackbar, Alert } from "@mui/material";
import { ExpandAltOutlined } from "@ant-design/icons";
const InforUserPage = () => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeSection, setActiveSection] = useState("account");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Invoices, setInvoice] = useState([]);
  const [Tickets, setTicket] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    bankName: "",
  });
  const [showBankForm, setShowBankForm] = useState(false);
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
        const response = await getUserInfor();
        console.log("respone", response);
        const InvoicesRes = await handleGetInvoiceByUserId(response.result.id);
        const ticketRes = await handleGetTicketByUserId(response.result.id);

        const responseBL = await axios.get("https://api.vietqr.io/v2/banks");
        if (responseBL.data.code === "00") {
          setBankList(responseBL.data.data);
        } else {
          handleOpenSnackBar("Lấy danh sách ngân hàng thất bại!", "error");
        }
        //  console.log("bank list", responseBL);
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
            id: result.id || null, // Lưu id người dùng
          });
          setAvatar(result.avatar || "/images/avatar.jpg");
        } else {
          handleOpenSnackBar("Lấy thông tin người dùng thất bại!", "error");
        }

        if (ticketRes?.code === 1000) {
          setTicket(ticketRes.result || []);
        } else {
          handleOpenSnackBar("Lấy danh sách vé thất bại!", "error");
        }

        if (InvoicesRes?.code === 1000) {
          setInvoice(InvoicesRes.result || []);
        } else {
          handleOpenSnackBar("Lấy lịch sử hóa đơn thất bại!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        handleOpenSnackBar(
          error?.response?.data?.message || "Lỗi khi lấy dữ liệu!",
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
      const updateRes = await updateUserInfor(formData);
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
        error?.response?.data?.message || "Lỗi khi cập nhật thông tin!",
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

  const getInvoiceColumns = () => {
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
        render: (amount) =>
          amount ? `${amount.toFixed(2)} VNĐ` : "Chưa xác định",
      },
      {
        title: "Thời gian đặt",
        dataIndex: "timeOfBooking",
        key: "timeOfBooking",
        render: (text) => {
          if (!text) return "Chưa xác định";
          const date = new Date(text);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        },
      },

      {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (method) => {
          const methods = {
            0: "Tiền mặt",
            1: "Thanh toán online",
          };
          return methods[method] || `Phương thức ${method}`;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusMap = {
            0: "Đã hủy",
            1: "Chờ thanh toán",
            2: "Đã thanh toán",
            3: "Thành công",
            4: "Chờ xử lý hủy",
          };
          return statusMap[status] || "Không xác định";
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <div>
            <Button
              type="primary"
              ghost
              onClick={() => handleTicketCancel(record)}
            >
              Hủy vé
            </Button>
          </div>
        ),
      },
      {
        title: "Xem chi tiết",
        key: "action",
        render: (_, record) => (
          <div>
            <Button
              type="primary"
              ghost
              onClick={() => handleViewTicketDetails(record.id)}
            >
              <ExpandAltOutlined />
            </Button>
          </div>
        ),
      },
    ];
  };

  const getTicketColumns = () => {
    return [
      {
        title: "Mã vé",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Vị trí ghế",
        dataIndex: ["seatPosition", "name"],
        key: "seatName",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Thời gian khởi hành",
        dataIndex: ["invoice", "busTrip", "departureTime"],
        key: "departureTime",
        render: (text) => {
          if (!text) return "Chưa xác định";
          const date = new Date(text);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${day}/${month}/${year} ${hours}:${minutes}`;
        },
      },
      {
        title: "Giá vé",
        dataIndex: ["invoice", "busTrip", "price"],
        key: "price",
        render: (price) =>
          price ? `${price.toFixed(2)} VNĐ` : "Chưa xác định",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusMap = {
            0: "Đã hủy",
            1: "Hiệu lực",
          };
          return statusMap[status] || "Không xác định";
        },
      },
    ];
  };
  const handleBankDetailsChange = (name, value) => {
    setBankDetails({ ...bankDetails, [name]: value });
  };
  const handleViewTicketDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowTicketDetails(true);
  };

  const handleTicketCancel = (record) => {
    setSelectedTicket(record);

    const departureTime = new Date(record.busTrip.departureTime);
    const currentTime = new Date();

    console.log("statusd", record.status);
    if (!record || record.status === undefined) {
      handleOpenSnackBar("Dữ liệu vé không hợp lệ!", "error");
      return;
    }

    if (record.status === 1) {
      // chờ thanh toán thì hủy vé ko cần nhập stk

      if (new Date(record.busTrip.departureTime) < new Date()) {
        handleOpenSnackBar(
          "Không thể hủy vé vì chuyến xe đã khởi hành!",
          "error"
        );
        return;
      }
      setSelectedInvoiceId(null);
      setShowCancelConfirm(true);
    } else if (record.status === 2) {
      setSelectedInvoiceId(record.id);

      setShowBankForm(true);
    } else {
      handleOpenSnackBar("Vé đã hủy!", "error");
    }
  };

  // const handleBankDetailsChange = (e) => {
  //   const { name, value } = e.target;
  //   setBankDetails({ ...bankDetails, [name]: value });
  // };

  const handleBankDetailsSubmit = async () => {
    if (!bankDetails.bankAccountNumber || !bankDetails.bankName) {
      handleOpenSnackBar("Vui lòng điền đầy đủ thông tin ngân hàng!", "error");
      return;
    }

    try {
      const response = await handleAddBankDT({
        idUser: selectedTicket.user.id,
        idInvoice: selectedTicket.id,
        bankName: bankDetails.bankName,
        bankAccountNumber: bankDetails.bankAccountNumber,
      });

      if (response.code === 1000) {
        // Cập nhật trạng thái hóa đơn thành "Chờ xử lý hủy" (status = 4)
        const cancelRes = await handleUpdateInvoiceStatus(selectedInvoiceId, 4);

        if (cancelRes.code === 1000) {
          handleOpenSnackBar(
            "Cập nhật thông tin ngân hàng thành công, vui lòng đợi chúng tôi xử lý!",
            "success"
          );
          // Làm mới danh sách Invoices từ API
          const InvoicesRes = await handleGetInvoiceByUserId(userInfo.phone);
          if (InvoicesRes?.code === 1000) {
            setInvoice(InvoicesRes.result || []);
          } else {
            handleOpenSnackBar("Lấy danh sách hóa đơn thất bại!", "error");
          }
        } else {
          handleOpenSnackBar(
            cancelRes.message || "Cập nhật trạng thái hóa đơn thất bại!",
            "error"
          );
        }
        setBankDetails({ bankAccountNumber: "", bankName: "" });
        setShowBankForm(false);
      } else {
        handleOpenSnackBar(
          response.data?.message || "Lỗi khi cập nhật thông tin ngân hàng!",
          "error"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin ngân hàng:", error);
      handleOpenSnackBar(
        error?.response?.data?.message ||
          "Lỗi khi cập nhật thông tin ngân hàng!",
        "error"
      );
    }
  };
  const confirmTicketCancel = async () => {
    try {
      const cancelRes = await handleUpdateInvoiceStatus(selectedTicket.id, 0);
      console.log("cancelRes", cancelRes);
      if (cancelRes.code === 1000) {
        handleOpenSnackBar("Hủy vé thành công!", "success");
        // Update the invoice list
        setInvoice((prev) =>
          prev.map((invoice) =>
            invoice.id === selectedTicket.id
              ? { ...invoice, status: 2 }
              : invoice
          )
        );
      } else {
        handleOpenSnackBar(cancelRes.message || "Hủy vé thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi hủy vé!",
        "error"
      );
    } finally {
      setShowCancelConfirm(false);
      setSelectedTicket(null);
    }
  };

  const BankDetailsModal = (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 text-sm text-gray-800">
        <div>
          <label className="block text-gray-500 mb-1">Tên ngân hàng:</label>

          <Select
            name="bankName"
            value={bankDetails.bankName.code}
            onChange={(value) => handleBankDetailsChange("bankName", value)}
            placeholder="Chọn ngân hàng"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children &&
              typeof option.children === "string" &&
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            className="w-full"
          >
            {Array.isArray(bankList) && bankList.length > 0 ? (
              bankList
                .filter((bank) => bank.isTransfer === 1)
                .map((bank) => (
                  <Select.Option key={bank.code} value={bank.code}>
                    {bank.shortName && bank.name
                      ? `${bank.shortName} - ${bank.name}`
                      : bank.name ||
                        bank.shortName ||
                        "Ngân hàng không xác định"}
                  </Select.Option>
                ))
            ) : (
              <Select.Option disabled value="">
                Không có ngân hàng nào khả dụng
              </Select.Option>
            )}
          </Select>
        </div>
        <div>
          <label className="block text-gray-500 mb-1">
            Số tài khoản ngân hàng:
          </label>
          <Input
            type="text"
            name="bankAccountNumber"
            value={bankDetails.bankAccountNumber}
            onChange={(e) =>
              handleBankDetailsChange("bankAccountNumber", e.target.value)
            }
            placeholder="Nhập số tài khoản ngân hàng"
          />
        </div>
      </div>
    </div>
  );
  const CancelModal = (
    <div className="p-4">
      <p className="text-gray-800">
        Bạn có chắc chắn muốn hủy vé có mã <strong>{selectedTicket?.id}</strong>{" "}
        không? Hành động này không thể hoàn tác.
      </p>
    </div>
  );

  const TicketDetailsModal = (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4"></h3>
      <Table
        columns={getTicketColumns()}
        dataSource={Tickets.filter(
          (ticket) => ticket.invoice.id === selectedInvoiceId
        )}
        rowKey="id"
        pagination={false}
      />
    </div>
  );

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
            columns={getInvoiceColumns()}
            dataSource={Invoices.filter((invoice) => invoice.status !== 1)}
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
                alt="Lịch sử vé"
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

        <Modal
          title="Xác nhận hủy vé"
          open={showCancelConfirm}
          onOk={confirmTicketCancel}
          onCancel={() => setShowCancelConfirm(false)}
          width={600}
          okText="Hủy vé"
          cancelText="Không"
          okButtonProps={{
            style: { backgroundColor: "#ef5222", borderColor: "#ef5222" },
          }}
        >
          {CancelModal}
        </Modal>

        <Modal
          title="Nhập thông tin ngân hàng"
          open={showBankForm}
          onOk={handleBankDetailsSubmit}
          onCancel={() => {
            setShowBankForm(false);
            setBankDetails({ bankAccountNumber: "", bankName: "" });
          }}
          width={600}
          okText="Lưu"
          cancelText="Hủy"
          okButtonProps={{
            style: { backgroundColor: "#ef5222", borderColor: "#ef5222" },
          }}
        >
          {BankDetailsModal}
        </Modal>

        <Modal
          title={`Chi tiết vé của hóa đơn #${selectedInvoiceId}`}
          open={showTicketDetails}
          onCancel={() => setShowTicketDetails(false)}
          footer={null}
          width={800}
        >
          {TicketDetailsModal}
        </Modal>
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
