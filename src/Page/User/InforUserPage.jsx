import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserInfor,
  updateUserInfor,
  updatePassword,
} from "../../services/UserService";
import {
  handleGetInvoiceByUserId,
  getTicketsByInvoiceId,
  changeTicket,
  handleUpdateInvoiceStatus,
  handleAddBankDT,
  handleGetBankList,
} from "../../services/InvoiceService";
import { handleUpdateTicketStatus } from "../../services/ticketService";
import { handleGetAllProvince } from "../../services/BusStationService";
import { searchTripsByProvinces } from "../../services/HomeService";
import { fetchSeatLayout } from "../../services/SeatSelectionService";
import { Snackbar, Alert } from "@mui/material";
import { Table, Modal, Button, Input, Select as AntdSelect } from "antd";
import { format, parseISO } from "date-fns";
import Select from "react-select";
import { handleGetTicketByUserId } from "../../services/ticketService";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";

const InforUserPage = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
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
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState(false);
  const [isChangeTicketModalVisible, setIsChangeTicketModalVisible] =
    useState(false);
  const [isSeatSelectionModalVisible, setIsSeatSelectionModalVisible] =
    useState(false);
  const [changeTicketId, setChangeTicketId] = useState(null);
  const [newBusId, setnewBusId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [upperSeats, setUpperSeats] = useState([]);
  const [lowerSeats, setLowerSeats] = useState([]);
  const [currentTicketPrice, setCurrentTicketPrice] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [ticketCount, setTicketCount] = useState("1");
  const [trips, setTrips] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [routeTitle, setRouteTitle] = useState("");
  const [filters, setFilters] = useState({
    timeRanges: [],
    busTypes: [],
    floors: [],
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [Tickets, setTicket] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [bankList, setBankList] = useState([]);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    bankName: "",
  });
  const [showBankForm, setShowBankForm] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState([]); // Array các ticket được chọn để hủy
  const [showCancelTicketModal, setShowCancelTicketModal] = useState(false);
  const [selectedInvoiceCancel, setSelectedInvoiceCancel] = useState(null);
  const [selectedTicketCancel, setSelectedTicketCancel] = useState(null);

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy");
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Lỗi định dạng ngày giờ:", error);
      return dateString;
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await handleGetAllProvince();
        const formattedProvinces = response.result.map((province) => ({
          value: province.id,
          label: province.name,
        }));
        setProvinces(formattedProvinces);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        handleOpenSnackBar("Lỗi khi lấy danh sách tỉnh thành!", "error");
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await getUserInfor();
        const InvoicesRes = await handleGetInvoiceByUserId(response.result.id);
        //    const ticketRes = await handleGetTicketByPhone(response.result.phone);

        const responseBL = await axios.get("https://api.vietqr.io/v2/banks");
        if (responseBL.data.code === "00") {
          setBankList(responseBL.data.data);
        } else {
          handleOpenSnackBar("Lấy danh sách ngân hàng thất bại!", "error");
        }
        console.log("bank list", responseBL);
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

        // if (ticketRes?.code === 1000) {
        //   setTicket(ticketRes.result || []);
        // } else {
        //   handleOpenSnackBar("Lấy danh sách vé thất bại!", "error");
        // }

        if (InvoicesRes?.code === 1000) {
          setInvoices(InvoicesRes.result || []);
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

  // Tải sơ đồ ghế khi mở modal chọn ghế
  useEffect(() => {
    const getSeatLayout = async () => {
      console.log(newBusId);
      if (newBusId) {
        try {
          const { upperSeats, lowerSeats, bookedSeats } = await fetchSeatLayout(
            newBusId
          );
          setUpperSeats(upperSeats);
          setLowerSeats(lowerSeats);
          setBookedSeats(bookedSeats);
        } catch (error) {
          console.error("Không thể tải sơ đồ ghế:", error);
          handleOpenSnackBar("Không thể tải sơ đồ ghế!", "error");
        }
      }
    };
    if (isSeatSelectionModalVisible) {
      getSeatLayout();
    }
  }, [isSeatSelectionModalVisible, newBusId]);

  const filteredDestinations = provinces.filter(
    (province) => province.value !== (departure?.value || "")
  );

  const filteredDepartures = provinces.filter(
    (province) => province.value !== (destination?.value || "")
  );

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    setShowLogoutConfirm(false);
    navigate("/login");
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
      const res = await updatePassword({ currentPassword, newPassword });
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

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate) {
      handleOpenSnackBar(
        "Vui lòng chọn điểm đi, điểm đến và ngày đi!",
        "error"
      );
      return;
    }
    try {
      const response = await searchTripsByProvinces(
        departure.value,
        destination.value,
        departureDate,
        ticketCount
      );
      setTrips(response.result);
      setShowSearchResults(true);
      setRouteTitle(
        `${departure.label} - ${destination.label} (${response.result.length})`
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chuyến xe:", error);
      handleOpenSnackBar(
        "Không tìm thấy chuyến xe. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const calculateArrivalTime = (departureTime, travelTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(departure);
    const hours = Math.floor(travelTime);
    const minutes = Math.round((travelTime % 1) * 60);
    arrival.setHours(departure.getHours() + hours);
    arrival.setMinutes(departure.getMinutes() + minutes);
    return arrival.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTimeRangeFilter = (range) => {
    setFilters((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.includes(range)
        ? prev.timeRanges.filter((r) => r !== range)
        : [...prev.timeRanges, range],
    }));
  };

  const handleBusTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      busTypes: prev.busTypes.includes(type)
        ? prev.busTypes.filter((t) => t !== type)
        : [...prev.busTypes, type],
    }));
  };

  const handleFloorFilter = (floor) => {
    setFilters((prev) => ({
      ...prev,
      floors: prev.floors.includes(floor)
        ? prev.floors.filter((f) => f !== floor)
        : [...prev.floors, floor],
    }));
  };

  const handleClearFilters = () => {
    setFilters({ timeRanges: [], busTypes: [], floors: [] });
    handleOpenSnackBar("Đã xóa tất cả bộ lọc", "success");
  };

  const getTripCountByTimeRange = (range) => {
    return trips.filter((trip) => {
      const departureHour = new Date(trip.departureTime).getHours();
      if (range === "earlyMorning" && departureHour >= 0 && departureHour < 6)
        return true;
      if (range === "morning" && departureHour >= 6 && departureHour < 12)
        return true;
      if (range === "afternoon" && departureHour >= 12 && departureHour < 18)
        return true;
      if (range === "evening" && departureHour >= 18 && departureHour <= 23)
        return true;
      return false;
    }).length;
  };

  const getTripCountByFloor = (floor) => {
    return trips.filter((trip) => {
      if (floor === "Tầng trên" && trip.countA >= parseInt(ticketCount))
        return true;
      if (floor === "Tầng dưới" && trip.countB >= parseInt(ticketCount))
        return true;
      return false;
    }).length;
  };

  const filterTrips = (trips) => {
    return trips.filter((trip) => {
      let passTimeFilter = true;
      if (filters.timeRanges.length > 0) {
        const departureHour = new Date(trip.departureTime).getHours();
        passTimeFilter = filters.timeRanges.some((range) => {
          if (
            range === "earlyMorning" &&
            departureHour >= 0 &&
            departureHour < 6
          )
            return true;
          if (range === "morning" && departureHour >= 6 && departureHour < 12)
            return true;
          if (
            range === "afternoon" &&
            departureHour >= 12 &&
            departureHour < 18
          )
            return true;
          if (range === "evening" && departureHour >= 18 && departureHour <= 23)
            return true;
          return false;
        });
      }
      const passBusTypeFilter =
        filters.busTypes.length === 0 ||
        filters.busTypes.includes(trip.bus.busType.name);
      let passFloorFilter = true;
      if (filters.floors.length > 0) {
        if (
          filters.floors.includes("Tầng trên") &&
          filters.floors.includes("Tầng dưới")
        ) {
          passFloorFilter = trip.countA + trip.countB >= parseInt(ticketCount);
        } else {
          passFloorFilter = filters.floors.some((floor) => {
            if (floor === "Tầng trên" && trip.countA >= parseInt(ticketCount))
              return true;
            if (floor === "Tầng dưới" && trip.countB >= parseInt(ticketCount))
              return true;
            return false;
          });
        }
      } else {
        passFloorFilter = trip.countA + trip.countB >= parseInt(ticketCount);
      }
      const passPriceFilter =
        currentTicketPrice === null || trip.price <= currentTicketPrice;
      return (
        passTimeFilter &&
        passBusTypeFilter &&
        passFloorFilter &&
        passPriceFilter
      );
    });
  };

  const filteredTrips = filterTrips(trips);

  useEffect(() => {
    if (showSearchResults && departure && destination) {
      setRouteTitle(
        `${departure.label} - ${destination.label} (${filteredTrips.length})`
      );
    }
  }, [filteredTrips, departure, destination, showSearchResults]);

  const handleViewTickets = async (invoice) => {
    try {
      setIsLoading(true);
      const ticketRes = await getTicketsByInvoiceId(invoice.id);
      if (ticketRes?.code === 1000) {
        setSelectedInvoice({ ...invoice, tickets: ticketRes.result || [] });
        setIsTicketModalVisible(true);
      } else {
        handleOpenSnackBar(
          ticketRes?.message || "Lấy thông tin vé thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin vé:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi lấy thông tin vé!",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketModalClose = () => {
    setIsTicketModalVisible(false);
    //  setSelectedInvoice(null);
  };

  const handleChangeTicket = (ticketId) => {
    const ticket = selectedInvoice.tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setCurrentTicketPrice(ticket.invoice.busTrip.price || 0);
      setChangeTicketId(ticketId);
      setIsChangeTicketModalVisible(true);
    } else {
      handleOpenSnackBar("Không tìm thấy thông tin vé!", "error");
    }
  };

  const handleChangeTicketModalClose = () => {
    setIsChangeTicketModalVisible(false);
    setChangeTicketId(null);
    setTrips([]);
    setShowSearchResults(false);
    setDeparture(null);
    setDestination(null);
    setDepartureDate("");
    setTicketCount("1");
    setFilters({ timeRanges: [], busTypes: [], floors: [] });
  };

  const handleSeatSelectionModalClose = () => {
    setIsSeatSelectionModalVisible(false);
    setSelectedSeats([]);
    setUpperSeats([]);
    setLowerSeats([]);
    setBookedSeats([]);
    setnewBusId(null);
  };

  const handleSeatSelection = (seat, selectedSeats, setSelectedSeats) => {
    setSelectedSeats((prev) => (prev.includes(seat) ? [] : [seat]));
  };

  const handleConfirmChangeTicket = async (trip) => {
    if (!trip) {
      handleOpenSnackBar("Không tìm thấy chuyến xe!", "error");
      return;
    }

    if (trip.price > currentTicketPrice) {
      handleOpenSnackBar(
        "Chỉ được đổi vé có giá thấp hơn hoặc bằng giá vé hiện tại!",
        "error"
      );
      return;
    }

    setnewBusId(trip.bus.id);
    setIsSeatSelectionModalVisible(true);
  };

  const handleConfirmSeatSelection = async () => {
    if (selectedSeats.length === 0) {
      handleOpenSnackBar("Vui lòng chọn một ghế!", "error");
      return;
    }
    try {
      setIsLoading(true);
      const res = await changeTicket(changeTicketId, newBusId, selectedSeats);
      if (res.code === 1000) {
        handleOpenSnackBar("Đổi vé thành công!", "success");
        const ticketRes = await getTicketsByInvoiceId(selectedInvoice.id);
        if (ticketRes?.code === 1000) {
          setSelectedInvoice({
            ...selectedInvoice,
            tickets: ticketRes.result || [],
          });
        }
        handleSeatSelectionModalClose();
        handleChangeTicketModalClose();
      } else {
        handleOpenSnackBar(res.message || "Đổi vé thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi đổi vé:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi đổi vé!",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getColumns = () => {
    return [
      { title: "Mã Hóa đơn", dataIndex: "id", key: "id" },
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
      { title: "Số vé", dataIndex: "numberOfTickets", key: "numberOfTickets" },
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
        render: (text) => (text ? formatDateTime(text) : "Chưa xác định"),
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        render: (method) => {
          const methods = {
            2: "Chưa thanh toán",
            1: "Thanh toán online",
            0: "Tiền mặt",
          };
          return methods[method] || `Phương thức ${method}`;
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
              onClick={() => handleShowTableCancel(record)}
            >
              Hủy vé
            </Button>
          </div>
        ),
      },

      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => handleViewTickets(record)}
            className="bg-[#ef5222] hover:bg-orange-600"
          >
            Xem thông tin vé
          </Button>
        ),
      },
    ];
  };

  const ticketColumns = [
    { title: "Mã vé", dataIndex: "id", key: "id" },
    {
      title: "Số ghế",
      dataIndex: "seatPosition",
      key: "seatNumber",
      render: (seatPosition) => seatPosition?.name || "Chưa xác định",
    },
    {
      title: "Loại vé",
      dataIndex: ["invoice", "busTrip", "bus", "busType", "name"],
      key: "ticketType",
      render: (busTypeName) => busTypeName || "Thường",
    },
    {
      title: "Giá vé",
      dataIndex: ["invoice", "busTrip", "price"],
      key: "price",
      render: (price) => `${(price || 0).toFixed(2)} VNĐ`,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: ["invoice", "busTrip", "departureTime"],
      key: "departureTime",
      render: (departureTime) =>
        departureTime ? formatDateTime(departureTime) : "Chưa xác định",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          0: " Đã hủy",
          1: "Đã đặt",
          2: "Chờ xử lý",
          3: "Hoàn thành",
          4: "Đổi vé",
        };
        return statusMap[status] || "Không xác định";
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        selectedInvoice?.status === 2 && record.status === 1 ? (
          <Button
            type="primary"
            onClick={() => handleChangeTicket(record.id)}
            className="bg-[#ef5222] hover:bg-orange-600"
          >
            Đổi vé
          </Button>
        ) : null,
    },
  ];
  const ticketCancelColumns = () => [
    {
      title: "",
      dataIndex: "id",
      key: "checkbox",
      render: (id, record) => (
        <input
          type="checkbox"
          onChange={(e) => handleSelectTicket(record, e.target.checked)}
          checked={selectedTickets.some((ticket) => ticket.id === record.id)}
          disabled={![1, 2].includes(record.status)} // Chỉ cho phép chọn nếu status 1 hoặc 2
        />
      ),
      width: 50,
    },
    { title: "Mã vé", dataIndex: "id", key: "id" },
    {
      title: "Số ghế",
      dataIndex: "seatPosition",
      key: "seatNumber",
      render: (seatPosition) => seatPosition?.name || "Chưa xác định",
    },
    {
      title: "Loại vé",
      dataIndex: ["invoice", "busTrip", "bus", "busType", "name"],
      key: "ticketType",
      render: (busTypeName) => busTypeName || "Thường",
    },
    {
      title: "Giá vé",
      dataIndex: ["invoice", "busTrip", "price"],
      key: "price",
      render: (price) => `${(price || 0).toFixed(2)} VNĐ`,
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: ["invoice", "busTrip", "departureTime"],
      key: "departureTime",
      render: (departureTime) =>
        departureTime ? formatDateTime(departureTime) : "Chưa xác định",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          0: "Đã hủy",
          1: "Đã đặt",
          2: "Chờ xử lý",
          3: "Hoàn thành",
          4: "Đổi vé",
          5: "Đang xử lý hủy",
        };
        return statusMap[status] || "Không xác định";
      },
    },
  ];

  const handleSelectTicket = (record, checked) => {
    setSelectedTickets((prev) =>
      checked
        ? [...prev, record]
        : prev.filter((ticket) => ticket.id !== record.id)
    );
    console.log("select", selectedTickets); // Lưu ý: console.log có thể không hiển thị giá trị mới ngay lập tức
  };

  const handleCancelTicket = async () => {
    try {
      if (selectedTickets.length === 0) {
        handleOpenSnackBar("Vui lòng chọn vé để hủy!", "error");
        return;
      }

      // Bật trạng thái đang tải
      setIsLoading(true);

      // Tạo mảng promise để cập nhật trạng thái vé
      const cancelPromises = selectedTickets.map(async (ticket) => {
        // Kiểm tra trạng thái vé
        if (ticket.status === 0) {
          throw new Error(`Vé ${ticket.id} đã được hủy trước đó!`);
        }
        if (ticket.status === 3) {
          throw new Error(`Vé ${ticket.id} đã hoàn thành, không thể hủy!`);
        }
        // Kiểm tra thời gian khởi hành
        if (new Date(ticket.invoice.busTrip.departureTime) < new Date()) {
          throw new Error(`Chuyến xe của vé ${ticket.id} đã khởi hành!`);
        }
        // Cập nhật trạng thái vé thành 5
        await handleUpdateTicketStatus(ticket.id, 5);
      });

      // Chờ tất cả các yêu cầu hoàn tất
      const results = await Promise.allSettled(cancelPromises);

      // Kiểm tra kết quả
      const failedCancellations = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedCancellations.length > 0) {
        const errorMessages = failedCancellations
          .map((result) => result.reason.message)
          .join("; ");
        handleOpenSnackBar(`Có lỗi khi hủy vé: ${errorMessages}`, "error");
        return;
      }

      // Hiển thị thông báo thành công
      handleOpenSnackBar("Hủy vé thành công!", "success");

      // Làm mới danh sách hóa đơn
      const InvoicesRes = await handleGetInvoiceByUserId(userInfo.id);
      if (InvoicesRes?.code === 1000) {
        setInvoices(InvoicesRes.result || []);
      } else {
        handleOpenSnackBar("Lấy danh sách hóa đơn thất bại!", "error");
      }

      // Đóng modal và xóa danh sách vé đã chọn
      setShowTicketDetails(false);
      setSelectedTickets([]);
      setSelectedInvoiceCancel(null);
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi hủy vé!",
        "error"
      );
    } finally {
      // Tắt trạng thái đang tải
      setIsLoading(false);
    }
  };
  const handleShowTableCancel = async (record) => {
    try {
      const ticketRes = await getTicketsByInvoiceId(record.id); // Sửa: Lấy vé theo invoice id
      if (ticketRes?.code === 1000) {
        setSelectedTicketCancel(ticketRes.result || []);
      } else {
        handleOpenSnackBar("Lấy danh sách vé thất bại!", "error");
        return;
      }
      setSelectedInvoiceCancel(record);
      setShowTicketDetails(true);
    } catch (error) {
      console.error("Lỗi khi lấy vé:", error);
      handleOpenSnackBar("Lấy danh sách vé thất bại!", "error");
    }
  };
  // huy ve

  const handleConfirmCancelTickets = async () => {
    if (selectedTickets.length === 0) {
      handleOpenSnackBar("Vui lòng chọn ít nhất một vé để hủy!", "error");
      return;
    }

    try {
      setIsLoading(true);
      const promises = selectedTickets.map(async (ticket) => {
        if (ticket.status === 1) {
          // If ticket is booked, show bank details form
          setSelectedInvoiceId(ticket.id);
          setShowBankForm(true);
        } else if (ticket.status === 2) {
          // If ticket is pending payment, cancel directly
          await handleUpdateTicketStatus(ticket.id, 0);
        }
      });

      await Promise.all(promises);
      handleOpenSnackBar("Hủy vé thành công!", "success");

      // Refresh invoice list
      const InvoicesRes = await handleGetInvoiceByUserId(userInfo.id);
      if (InvoicesRes?.code === 1000) {
        setInvoices(InvoicesRes.result || []);
      } else {
        handleOpenSnackBar("Lấy danh sách hóa đơn thất bại!", "error");
      }

      setShowCancelTicketModal(false);
      setSelectedTickets([]);
    } catch (error) {
      console.error("Lỗi khi hủy vé:", error);
      handleOpenSnackBar(
        error?.response?.data?.message || "Lỗi khi hủy vé!",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };
  console.log("checkckc", selectedTicketCancel);

  const handleTicketCancel = (record) => {
    setSelectedTicket(record);
    console.log("record", record);
    // const departureTime = new Date(record.busTrip.departureTime);
    // const currentTime = new Date();

    console.log("statusd", record.status);
    if (!record || record.status === undefined) {
      handleOpenSnackBar("Dữ liệu vé không hợp lệ!", "error");
      return;
    }

    if (record.status === 2) {
      // chờ thanh toán thì hủy vé ko cần nhập stk

      if (new Date(record.busTrip.departureTime) < new Date()) {
        handleOpenSnackBar("Chuyến xe đã hoàn thành!", "error");
        return;
      }
      setSelectedInvoiceId(null);
      setShowCancelConfirm(true);
    } else if (record.status === 1) {
      setSelectedInvoiceId(record.id);

      setShowBankForm(true);
    } else {
      handleOpenSnackBar("Vé đã hủy!", "error");
    }
  };

  const handleBankDetailsChange = (name, value) => {
    setBankDetails({ ...bankDetails, [name]: value });
  };
  const handleViewTicketDetails = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setShowTicketDetails(true);
  };

  const handleBankDetailsSubmit = async () => {
    if (!bankDetails.bankAccountNumber || !bankDetails.bankName) {
      handleOpenSnackBar("Vui lòng điền đầy đủ thông tin ngân hàng!", "error");
      return;
    }

    console.log("check ticket ", selectedTicket, bankDetails);
    try {
      const response = await handleAddBankDT({
        idUser: selectedTicket.invoice.user.id,
        idInvoice: selectedTicket.id,
        bankName: bankDetails.bankName,
        bankAccountNumber: bankDetails.bankAccountNumber,
      });

      if (response.code === 1000) {
        // Cập nhật trạng thái hóa đơn thành "Chờ xử lý hủy" (status = 4)
        const cancelRes = await handleUpdateTicketStatus(selectedInvoiceId, 2);

        if (cancelRes.code === 1000) {
          handleOpenSnackBar(
            "Cập nhật thông tin ngân hàng thành công, vui lòng đợi chúng tôi xử lý!",
            "success"
          );
          // Làm mới danh sách Invoices từ API
          const InvoicesRes = await handleGetInvoiceByUserId(userInfo.id);
          if (InvoicesRes?.code === 1000) {
            setInvoices(InvoicesRes.result || []);
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
        setInvoices((prev) =>
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

  const TicketDetailsModal = (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4"></h3>
      <Table
        columns={ticketCancelColumns()}
        dataSource={selectedTicketCancel}
        rowKey="id"
        pagination={false}
      />
      <Button
        type="primary"
        onClick={() => handleCancelTicket()}
        className="bg-[#ef5222] hover:bg-orange-600"
      >
        Hủy
      </Button>
    </div>
  );
  const BankDetailsModal = (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 text-sm text-gray-800">
        <div>
          <label className="block text-gray-500 mb-1">Tên ngân hàng:</label>

          <AntdSelect
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
                  <AntdSelect.Option key={bank.code} value={bank.code}>
                    {bank.shortName && bank.name
                      ? `${bank.shortName} - ${bank.name}`
                      : bank.name ||
                        bank.shortName ||
                        "Ngân hàng không xác định"}
                  </AntdSelect.Option>
                ))
            ) : (
              <AntdSelect.Option disabled value="">
                Không có ngân hàng nào khả dụng
              </AntdSelect.Option>
            )}
          </AntdSelect>
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

  const renderTicketDetails = () => {
    if (!selectedInvoice) return null;
    const tickets = selectedInvoice.tickets || [];
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Chi tiết vé</h3>
        {tickets.length > 0 ? (
          <Table
            columns={ticketColumns}
            dataSource={tickets}
            rowKey="id"
            pagination={false}
            className="border rounded-lg"
          />
        ) : (
          <p>
            Không có thông tin vé. Vui lòng liên hệ hỗ trợ để biết thêm chi
            tiết.
          </p>
        )}
        {selectedInvoice.status === 2 && (
          <p className="mt-4 text-sm text-gray-500">
            Hóa đơn này đang ở trạng thái có thể đổi vé.
          </p>
        )}
      </div>
    );
  };

  const renderChangeTicketModal = () => (
    <Modal
      title="Đổi vé"
      open={isChangeTicketModalVisible}
      onCancel={handleChangeTicketModalClose}
      footer={null}
      width="90%"
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <section className="bg-white p-8">
        <div className="rounded-[0.4rem] border border-[#EF5222]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 py-4 md:px-10 mb-[35px]">
            <Select
              options={filteredDepartures}
              value={departure}
              onChange={setDeparture}
              placeholder="Điểm đi"
              className="w-full text-lg"
              classNamePrefix="select"
              isSearchable
            />
            <Select
              options={filteredDestinations}
              value={destination}
              onChange={setDestination}
              placeholder="Điểm đến"
              className="w-full text-lg"
              classNamePrefix="select"
              isSearchable
            />
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="p-3 rounded-lg border w-full text-lg"
              aria-label="Chọn ngày đi"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSearch}
            className="bg-[#EF5222] text-white px-[77px] py-3 rounded-full font-semibold hover:brightness-105 shadow-lg"
            aria-label="Tìm chuyến xe"
          >
            Tìm chuyến xe
          </button>
        </div>
        {showSearchResults && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">BỘ LỌC TÌM KIẾM</h3>
                  <button
                    className="flex items-center text-red-500 text-base font-medium"
                    onClick={handleClearFilters}
                  >
                    Bỏ lọc
                    <img
                      src="/images/delete.svg"
                      alt="Xóa bộ lọc"
                      className="w-5 h-5 ml-1"
                    />
                  </button>
                </div>
                <div className="mb-4">
                  <p className="font-medium mb-2">Giờ đi</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>
                      <input
                        type="checkbox"
                        checked={filters.timeRanges.includes("earlyMorning")}
                        onChange={() => handleTimeRangeFilter("earlyMorning")}
                        aria-label="Sáng sớm 00:00 - 06:00"
                      />
                      <span className="ml-2 text-[15px]">
                        Sáng sớm 00:00 - 06:00 (
                        {getTripCountByTimeRange("earlyMorning")})
                      </span>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={filters.timeRanges.includes("morning")}
                        onChange={() => handleTimeRangeFilter("morning")}
                        aria-label="Buổi sáng 06:00 - 12:00"
                      />
                      <span className="ml-2 text-[15px]">
                        Buổi sáng 06:00 - 12:00 (
                        {getTripCountByTimeRange("morning")})
                      </span>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={filters.timeRanges.includes("afternoon")}
                        onChange={() => handleTimeRangeFilter("afternoon")}
                        aria-label="Buổi chiều 12:00 - 18:00"
                      />
                      <span className="ml-2 text-[15px]">
                        Buổi chiều 12:00 - 18:00 (
                        {getTripCountByTimeRange("afternoon")})
                      </span>
                    </li>
                    <li>
                      <input
                        type="checkbox"
                        checked={filters.timeRanges.includes("evening")}
                        onChange={() => handleTimeRangeFilter("evening")}
                        aria-label="Buổi tối 18:00 - 24:00"
                      />
                      <span className="ml-2 text-[15px]">
                        Buổi tối 18:00 - 24:00 (
                        {getTripCountByTimeRange("evening")})
                      </span>
                    </li>
                  </ul>
                </div>
                <hr className="my-4 border-t border-gray-300" />
                <div className="mb-4">
                  <p className="font-medium mb-2">Loại xe</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className={`px-3 py-1 border rounded text-[15px] ${
                        filters.busTypes.includes("Xe thường")
                          ? "bg-[#EF5222] text-white"
                          : ""
                      }`}
                      onClick={() => handleBusTypeFilter("Xe thường")}
                    >
                      Thường
                    </button>
                    <button
                      className={`px-3 py-1 border rounded text-[15px] ${
                        filters.busTypes.includes("Limousine")
                          ? "bg-[#EF5222] text-white"
                          : ""
                      }`}
                      onClick={() => handleBusTypeFilter("Limousine")}
                    >
                      Limousine
                    </button>
                  </div>
                </div>
                <hr className="my-4 border-t border-gray-300" />
                <div>
                  <p className="font-medium mb-2">Tầng</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className={`px-3 py-1 border rounded text-[15px] ${
                        filters.floors.includes("Tầng trên")
                          ? "bg-[#EF5222] text-white"
                          : ""
                      }`}
                      onClick={() => handleFloorFilter("Tầng trên")}
                    >
                      Tầng trên ({getTripCountByFloor("Tầng trên")})
                    </button>
                    <button
                      className={`px-3 py-1 border rounded text-[15px] ${
                        filters.floors.includes("Tầng dưới")
                          ? "bg-[#EF5222] text-white"
                          : ""
                      }`}
                      onClick={() => handleFloorFilter("Tầng dưới")}
                    >
                      Tầng dưới ({getTripCountByFloor("Tầng dưới")})
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="bg-white">
                  <h3 className="font-semibold text-xl mb-6">
                    {routeTitle || "Vui lòng tìm kiếm chuyến xe"}
                  </h3>
                  {filteredTrips.length === 0 ? (
                    <p className="text-center text-gray-500">
                      Không tìm thấy chuyến xe phù hợp.
                    </p>
                  ) : (
                    filteredTrips.map((trip) => (
                      <div
                        key={trip.id}
                        className="border border-gray-300 rounded-lg shadow-sm ring-1 ring-gray-100 px-5 py-4 mb-7"
                      >
                        <div className="flex justify-between items-start gap-6 mb-2">
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex flex-col items-start min-w-max">
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-semibold">
                                  {new Date(
                                    trip.departureTime
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <img
                                  src="/images/pickup.svg"
                                  alt="Điểm đón"
                                  className="w-5 h-5"
                                />
                                <div
                                  className="h-[2px] w-[80px] ml-2"
                                  style={{
                                    backgroundImage:
                                      "radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)",
                                    backgroundSize: "8px 2px",
                                    backgroundRepeat: "repeat-x",
                                  }}
                                ></div>
                              </div>
                              <p className="text-gray-500 text-[16px] mt-1">
                                {trip.busRoute.busStationFrom.name}
                              </p>
                            </div>
                            <div className="text-center min-w-max">
                              <p className="text-[15px] text-gray-500">
                                {trip.busRoute.travelTime} giờ
                              </p>
                              <p className="text-sm text-gray-400">
                                (Asia/Ho Chi Minh)
                              </p>
                            </div>
                            <div className="flex flex-col items-end min-w-max">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-[2px] w-[80px] mr-2"
                                  style={{
                                    backgroundImage:
                                      "radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)",
                                    backgroundSize: "8px 2px",
                                    backgroundRepeat: "repeat-x",
                                  }}
                                ></div>
                                <img
                                  src="/images/station.svg"
                                  alt="Điểm đến"
                                  className="w-5 h-5"
                                />
                                <p className="text-2xl font-semibold ml-2">
                                  {calculateArrivalTime(
                                    trip.departureTime,
                                    trip.busRoute.travelTime
                                  )}
                                </p>
                              </div>
                              <p className="text-gray-500 text-[16px] mt-1">
                                {trip.busRoute.busStationTo.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end text-[16px] text-gray-600 mt-1 min-w-max">
                            <div className="flex gap-2 items-center">
                              <span className="text-xl leading-none">•</span>
                              <span>{trip.bus.busType.name}</span>
                              <span className="text-xl leading-none">•</span>
                              <span
                                style={{ color: "#00613d" }}
                                className="font-semibold"
                              >
                                {trip.count} chỗ trống
                              </span>
                            </div>
                            <span className="text-red-500 font-semibold mt-1 text-[19px]">
                              {trip.price.toLocaleString("vi-VN")}đ
                            </span>
                          </div>
                        </div>
                        <hr className="my-4 border-t border-gray-300" />
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex gap-4 text-[15px] text-gray-500 font-medium">
                            <span>Chọn ghế</span>
                            <span>Lịch trình</span>
                            <span>Trung chuyển</span>
                            <span>Chính sách</span>
                          </div>
                          <button
                            onClick={() => handleConfirmChangeTicket(trip)}
                            className="bg-orange-100 text-orange-500 px-4 py-1 rounded-full text-[15px] font-medium"
                          >
                            Chọn chuyến
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </Modal>
  );

  const renderSeatSelectionModal = () => (
    <Modal
      title="Chọn ghế mới"
      open={isSeatSelectionModalVisible}
      onCancel={handleSeatSelectionModalClose}
      footer={[
        <Button key="cancel" onClick={handleSeatSelectionModalClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirmSeatSelection}
          className="bg-[#ef5222] hover:bg-orange-600"
          disabled={selectedSeats.length === 0}
        >
          Xác nhận đổi ghế
        </Button>,
      ]}
      width="90%"
      style={{ maxHeight: "90vh", overflowY: "auto" }}
    >
      <section className="bg-white p-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4 mx-3">
            <h2 className="text-xl font-semibold">Chọn ghế để đổi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6 ml-2">
            <div>
              <h4 className="text-sm font-semibold mb-4 text-center">
                Tầng trên
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {upperSeats.map((seat) => (
                  <div key={seat} className="flex flex-col items-center">
                    <img
                      src={
                        bookedSeats.includes(seat)
                          ? "/images/seat_disabled.svg"
                          : selectedSeats.includes(seat)
                          ? "/images/seat_selecting.svg"
                          : "/images/seat_active.svg"
                      }
                      alt={seat}
                      className="w-8 h-8 cursor-pointer"
                      onClick={() =>
                        !bookedSeats.includes(seat) &&
                        handleSeatSelection(
                          seat,
                          selectedSeats,
                          setSelectedSeats
                        )
                      }
                    />
                    <span className="text-[13px] mt-1">{seat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-center">
                Tầng dưới
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {lowerSeats.map((seat) => (
                  <div key={seat} className="flex flex-col items-center">
                    <img
                      src={
                        bookedSeats.includes(seat)
                          ? "/images/seat_disabled.svg"
                          : selectedSeats.includes(seat)
                          ? "/images/seat_selecting.svg"
                          : "/images/seat_active.svg"
                      }
                      alt={seat}
                      className="w-8 h-8 cursor-pointer"
                      onClick={() =>
                        !bookedSeats.includes(seat) &&
                        handleSeatSelection(
                          seat,
                          selectedSeats,
                          setSelectedSeats
                        )
                      }
                    />
                    <span className="text-[13px] mt-1">{seat}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ml-6">
              <h4 className="text-sm font-semibold mb-4">Ghi chú</h4>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>Đã bán</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 rounded"></div>
                  <span>Còn trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span>Đang chọn</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mt-4">
            <div className="flex justify-between mb-2">
              <span>Số lượng ghế</span>
              <span className="font-medium">{selectedSeats.length} Ghế</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Số ghế</span>
              <span className="font-medium">
                {selectedSeats.join(", ") || "-"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </Modal>
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
                {isEditing ? (
                  <input
                    type="date"
                    name="birthDate"
                    value={userInfo.birthDate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                ) : (
                  <p className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100">
                    {formatDate(userInfo.birthDate)}
                  </p>
                )}
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
            dataSource={invoices}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
          <Modal
            title="Thông tin vé"
            open={isTicketModalVisible}
            onCancel={handleTicketModalClose}
            width={720}
            footer={[
              <Button key="close" onClick={handleTicketModalClose}>
                Đóng
              </Button>,
            ]}
          >
            {renderTicketDetails()}
          </Modal>
          {renderChangeTicketModal()}
          {renderSeatSelectionModal()}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Header />
      <section className="bg-[#f7f7f7] py-6 px-4 bg-white">
        <div className="max-w-[1600px] mx-auto bg-white rounded-xl p-6 grid grid-cols-1 md:grid-cols-7 gap-8">
          <div className="md:col-span-2 flex flex-col gap-3 bg-white rounded-xl p-6 border">
            <button
              onClick={() => setActiveSection("account")}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition ${
                activeSection === "account"
                  ? "text-orange-600 bg-[#FFF3E0] hover:bg-[#FFE0B2]"
                  : "text-gray-600 hover:text-orange-500"
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
                  : "text-gray-600 hover:text-orange-500"
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
                  : "text-gray-600 hover:text-orange-500"
              }`}
            >
              <img
                src="/images/history.svg"
                className="w-7 h-7"
                alt="Lịch sử"
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
      <Modal
        title={`Chi tiết vé của hóa đơn #${selectedInvoiceId}`}
        open={showTicketDetails}
        onCancel={() => setShowTicketDetails(false)}
        footer={null}
        width={800}
      >
        {TicketDetailsModal}
      </Modal>
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

      <Footer />
    </div>
  );
};

export default InforUserPage;
