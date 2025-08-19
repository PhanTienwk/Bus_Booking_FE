import { Table, Popover, Button, Input, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  getAllInvoices,
  getAllInvoicesId,
  handleFilterInvoices,
  updateInvoice,
  handleAddBankDT,
  changeTicket,
  handleGetBankList,
} from "../../services/InvoiceService";
import { handleUpdateTicketStatus } from "../../services/ticketService";
import { searchTripsByProvinces } from "../../services/HomeService";
import { fetchSeatLayout } from "../../services/SeatSelectionService";
import { handleGetAllProvince } from "../../services/BusStationService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Modal,
  Box,
  Button as MuiButton,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import axios from "axios";

const FilterButtonInvoice = ({ onClose, onSubmit }) => {
  const [filterData, setFilterData] = useState({
    name: "",
    phone: "",
    email: "",
    status: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const handleStatusChange = (value) => {
    setFilterData({ ...filterData, status: value });
  };

  const handleSubmit = () => {
    onSubmit(filterData);
  };

  return (
    <div style={{ width: 300 }}>
      <div className="mb-3">
        <label className="form-label">Tên khách hàng</label>
        <Input
          name="name"
          placeholder="Nhập tên khách hàng"
          value={filterData.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Số điện thoại</label>
        <Input
          name="phone"
          placeholder="Nhập số điện thoại"
          value={filterData.phone}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <Input
          name="email"
          placeholder="Nhập email"
          value={filterData.email}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Trạng thái</label>
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn trạng thái"
          value={filterData.status}
          onChange={handleStatusChange}
        >
          <Select.Option value="">Tất cả</Select.Option>
          <Select.Option value="1">Chưa thanh toán</Select.Option>
          <Select.Option value="2">Đã thanh toán</Select.Option>
          <Select.Option value="0">Đã hủy</Select.Option>
          <Select.Option value="3">Thành công</Select.Option>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSubmit}>
          Lọc
        </Button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [filteredInvoiceList, setFilteredInvoiceList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({
    name: "",
    phone: "",
    email: "",
    status: "",
  });
  const [isChangeTicketModalVisible, setIsChangeTicketModalVisible] = useState(false);
  const [isSeatSelectionModalVisible, setIsSeatSelectionModalVisible] = useState(false);
  const [changeTicketId, setChangeTicketId] = useState(null);
  const [newBusId, setNewBusId] = useState(null);
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
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    bankAccountNumber: "",
    bankName: "",
  });
  const [bankList, setBankList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchInvoices();
    fetchProvinces();
    fetchBankList();
  }, []);

  useEffect(() => {
    setFilteredInvoiceList(invoiceList);
  }, [invoiceList]);

  const fetchInvoices = async () => {
    try {
      const response = await getAllInvoices();
      setInvoiceList(response.result || []);
      if (!filterParams.name && !filterParams.phone && !filterParams.email && !filterParams.status) {
        setFilteredInvoiceList(response.result || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách hóa đơn");
      console.error("Fetch invoice error:", error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await handleGetAllProvince();
      const formattedProvinces = response.result.map((province) => ({
        value: province.id,
        label: province.name,
      }));
      setProvinces(formattedProvinces);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách tỉnh thành!");
      console.error("Fetch provinces error:", error);
    }
  };

  const fetchBankList = async () => {
    try {
      const response = await axios.get("https://api.vietqr.io/v2/banks");
      if (response.data.code === "00") {
        setBankList(response.data.data);
      } else {
        toast.error("Lấy danh sách ngân hàng thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách ngân hàng!");
      console.error("Fetch bank list error:", error);
    }
  };

  const fetchTickets = async (invoiceId) => {
    try {
      const response = await getAllInvoicesId(invoiceId);
      setTickets(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vé");
      console.error("Fetch tickets error:", error);
    }
  };

  const fetchSeatLayoutData = async () => {
    if (newBusId) {
      try {
        const { upperSeats, lowerSeats, bookedSeats } = await fetchSeatLayout(newBusId);
        setUpperSeats(upperSeats);
        setLowerSeats(lowerSeats);
        setBookedSeats(bookedSeats);
      } catch (error) {
        toast.error("Không thể tải sơ đồ ghế!");
        console.error("Fetch seat layout error:", error);
      }
    }
  };

  useEffect(() => {
    if (isSeatSelectionModalVisible) {
      fetchSeatLayoutData();
    }
  }, [isSeatSelectionModalVisible, newBusId]);

  const confirmDelete = async () => {
    toast.success("Đã xóa hóa đơn (mô phỏng)");
    setConfirmDeleteOpen(false);
    setInvoiceToDelete(null);
    fetchInvoices();
  };

  const handleUpdate = (invoice) => {
    setSelectedInvoice(invoice);
    fetchTickets(invoice.id);
    setUpdateModalOpen(true);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    fetchTickets(invoice.id);
    setViewModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedInvoice = {
        id: selectedInvoice.id,
        name: selectedInvoice.name,
        phone: selectedInvoice.phone,
        email: selectedInvoice.email,
        status: selectedInvoice.status,
      };

      const response = await updateInvoice(selectedInvoice.id, updatedInvoice);
      if (response.code === 1000) {
        toast.success("Cập nhật hóa đơn thành công!");
        setUpdateModalOpen(false);
        setSelectedInvoice(null);
        setTickets([]);
        fetchInvoices();
      } else {
        toast.error(response.message || "Cập nhật hóa đơn thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật hóa đơn!");
      console.error("Update invoice error:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitPopover = async (filterData) => {
    try {
      const response = await handleFilterInvoices(filterData);
      if (response.code === 1000) {
        setFilterParams(filterData);
        setFilteredInvoiceList(response.result || []);
        toast.success("Lọc hóa đơn thành công!");
      } else {
        toast.error(response.message || "Lọc hóa đơn thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lọc hóa đơn!");
      console.error("Filter invoices error:", error);
    }
    setOpenFormFilter(false);
  };

  const handleChangeTicket = (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      setCurrentTicketPrice(ticket.invoice.busTrip.price || 0);
      setChangeTicketId(ticketId);
      setIsChangeTicketModalVisible(true);
    } else {
      toast.error("Không tìm thấy thông tin vé!");
    }
  };

  const handleCancelTicket = async (ticketId) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) {
      toast.error("Không tìm thấy thông tin vé!");
      return;
    }
    if (new Date(ticket.invoice.busTrip.departureTime) < new Date()) {
      toast.error("Chuyến xe đã khởi hành, không thể hủy!");
      return;
    }
    try {
      if (selectedInvoice.status === 2) {
        // Nếu hóa đơn đã thanh toán, yêu cầu thông tin ngân hàng
        setSelectedTicket(ticket);
        setShowBankForm(true);
      } else if (selectedInvoice.status === 1) {
        // Nếu hóa đơn chờ thanh toán, hủy trực tiếp
        const cancelRes = await handleUpdateTicketStatus(ticketId, 0);
        if (cancelRes.code === 1000) {
          toast.success("Hủy vé thành công!");
          fetchTickets(selectedInvoice.id);
        } else {
          toast.error(cancelRes.message || "Hủy vé thất bại!");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi hủy vé!");
      console.error("Cancel ticket error:", error);
    }
  };


  const handleSearch = async () => {
    if (!departure || !destination || !departureDate) {
      toast.error("Vui lòng chọn điểm đi, điểm đến và ngày đi!");
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
      toast.error("Không tìm thấy chuyến xe. Vui lòng thử lại!");
      console.error("Search trips error:", error);
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
    setNewBusId(null);
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prev) => (prev.includes(seat) ? [] : [seat]));
  };

  const handleConfirmChangeTicket = async (trip) => {
    if (!trip) {
      toast.error("Không tìm thấy chuyến xe!");
      return;
    }
    if (trip.price > currentTicketPrice) {
      toast.error("Chỉ được đổi vé có giá thấp hơn hoặc bằng giá vé hiện tại!");
      return;
    }
    setNewBusId(trip.id);
    setIsSeatSelectionModalVisible(true);
  };

  const handleConfirmSeatSelection = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn một ghế!");
      return;
    }
    try {
      const res = await changeTicket(changeTicketId, newBusId, selectedSeats);
      if (res.code === 1000) {
        toast.success("Đổi vé thành công!");
        fetchTickets(selectedInvoice.id);
        handleSeatSelectionModalClose();
        handleChangeTicketModalClose();
      } else {
        toast.error(res.message || "Đổi vé thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đổi vé!");
      console.error("Change ticket error:", error);
    }
  };

  const handleBankDetailsChange = (name, value) => {
    setBankDetails({ ...bankDetails, [name]: value });
  };

  const handleBankDetailsSubmit = async () => {
    if (!bankDetails.bankAccountNumber || !bankDetails.bankName) {
      toast.error("Vui lòng điền đầy đủ thông tin ngân hàng!");
      return;
    }
    try {
      const response = await handleAddBankDT({
        idUser: selectedTicket.invoice.user.id,
        idInvoice: selectedTicket.invoice.id,
        bankName: bankDetails.bankName,
        bankAccountNumber: bankDetails.bankAccountNumber,
      });
      if (response.code === 1000) {
        const cancelRes = await handleUpdateTicketStatus(selectedTicket.id, 5);
        if (cancelRes.code === 1000) {
          toast.success("Cập nhật thông tin ngân hàng thành công, vui lòng đợi xử lý!");
          fetchTickets(selectedInvoice.id);
        } else {
          toast.error(cancelRes.message || "Cập nhật trạng thái vé thất bại!");
        }
        setBankDetails({ bankAccountNumber: "", bankName: "" });
        setShowBankForm(false);
      } else {
        toast.error(response.message || "Lỗi khi cập nhật thông tin ngân hàng!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin ngân hàng!");
      console.error("Bank details submit error:", error);
    }
  };

  const filteredDestinations = provinces.filter(
    (province) => province.value !== (departure?.value || "")
  );

  const filteredDepartures = provinces.filter(
    (province) => province.value !== (destination?.value || "")
  );

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
    toast.success("Đã xóa tất cả bộ lọc");
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

  const getColumns = () => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số lượng vé",
      dataIndex: "numberOfTickets",
      key: "numberOfTickets",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) =>
        amount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return "Đã hủy";
          case 1:
            return "Chờ thanh toán";
          case 2:
            return "Đã thanh toán";
          case 3:
            return "Thành công";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <MuiButton color="primary" onClick={() => handleView(record)}>
            Xem chi tiết
          </MuiButton>
          <MuiButton
            color="info"
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 8 }}
          >
            Cập nhật
          </MuiButton>
        </>
      ),
    },
  ];

  const handlePrint = (ticketId) => {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    toast.error("Không tìm thấy thông tin vé!");
    return;
  }

  const ticketInfo = {
    name: selectedInvoice?.name || "Không xác định",
    email: selectedInvoice?.email || "Không xác định",
    seat: ticket?.seatPosition?.name || "Không xác định",
    departure: ticket?.invoice?.busTrip?.busRoute?.busStationFrom?.name || "Không xác định",
    destination: ticket?.invoice?.busTrip?.busRoute?.busStationTo?.name || "Không xác định",
    departureTime: ticket?.invoice?.busTrip?.departureTime || new Date(),
    status: ticket?.status || 0,
    busName: ticket?.seatPosition?.bus?.name || "Không xác định",
    price: ticket?.invoice?.busTrip?.price?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) || "Không xác định",
    ticketId: ticket?.id || "Không xác định",
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đã hủy";
      case 1:
        return "Đã đặt";
      case 2:
        return "Chờ xử lý";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đổi vé";
      case 5:
        return "Đang xử lý hủy";
      default:
        return "Không xác định";
    }
  };

  const WinPrint = window.open("", "", "width=900,height=650");
  WinPrint.document.write(`
    <html>
      <head>
        <title>In vé xe - ${ticketInfo.ticketId}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .ticket {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border: 2px solid #004aad;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 20px;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 2px dashed #004aad;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .ticket-header img.logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .ticket-header h1 {
            color: #004aad;
            font-size: 28px;
            margin: 0;
            font-weight: bold;
          }
          .ticket-header p {
            color: #333;
            font-size: 16px;
            margin: 5px 0;
          }
          .ticket-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            font-size: 16px;
            color: #333;
          }
          .ticket-body p {
            margin: 10px 0;
            line-height: 1.5;
          }
          .ticket-body .label {
            font-weight: bold;
            color: #004aad;
          }
          .ticket-footer {
            text-align: center;
            margin-top: 20px;
            border-top: 2px dashed #004aad;
            padding-top: 15px;
          }
          .ticket-footer .qr-placeholder {
            width: 120px;
            height: 120px;
            background: #ccc;
            display: inline-block;
            margin: 10px 0;
            border-radius: 5px;
          }
          .ticket-footer p {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .ticket-info {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
          }
          @media print {
            body {
              background: white;
              margin: 0;
            }
            .ticket {
              box-shadow: none;
              border: none;
            }
            .ticket-header img.logo {
              filter: grayscale(100%);
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-header">
            <img src="https://via.placeholder.com/120" alt="Logo" class="logo" />
            <h1>VÉ XE KHÁCH</h1>
            <p>CÔNG TY VẬN TẢI BUS BOOKING</p>
            <p>Mã vé: ${ticketInfo.ticketId}</p>
          </div>
          <div class="ticket-body">
            <p><span class="label">Tên khách hàng:</span> ${ticketInfo.name}</p>
            <p><span class="label">Email:</span> ${ticketInfo.email}</p>
            <p><span class="label">Vị trí ghế:</span> ${ticketInfo.seat}</p>
            <p><span class="label">Xe:</span> ${ticketInfo.busName}</p>
            <p><span class="label">Bến xuất phát:</span> ${ticketInfo.departure}</p>
            <p><span class="label">Bến đến:</span> ${ticketInfo.destination}</p>
            <p><span class="label">Thời gian xuất phát:</span> ${formatDateTime(ticketInfo.departureTime)}</p>
            <p><span class="label">Giá vé:</span> ${ticketInfo.price}</p>
            <p><span class="label">Trạng thái:</span> ${getStatusText(ticketInfo.status)}</p>
          </div>
          <div class="ticket-info">
            <p><span class="label">Lưu ý:</span> Vui lòng có mặt tại bến xe trước giờ khởi hành ít nhất 30 phút.</p>
            <p>Vé chỉ có giá trị cho hành khách và chuyến xe được chỉ định.</p>
          </div>
          <div class="ticket-footer">
            <div class="qr-placeholder"></div>
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Liên hệ hỗ trợ: 1900 1234 | Email: support@busbooking.com</p>
            <p>Website: www.busbooking.com</p>
          </div>
        </div>
      </body>
    </html>
  `);
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
};

  const ticketColumns = [
    {
      title: "ID Vé",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ghế ngồi",
      key: "nameSeatPosition",
      render: (_, record) => record?.seatPosition?.name || "Không xác định",
    },
    {
      title: "Xe đặt vé",
      key: "busSeatPosition",
      render: (_, record) => record?.seatPosition?.bus?.name || "Không xác định",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return "Đã hủy";
          case 1:
            return "Đã đặt";
          case 2:
            return "Chờ xử lý";
          case 3:
            return "Hoàn thành";
          case 4:
            return "Đổi vé";
          case 5:
            return "Đang xử lý hủy";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          {selectedInvoice?.status === 2 && record.status === 1 && (
            <MuiButton
              color="primary"
              onClick={() => handleChangeTicket(record.id)}
            >
              Đổi vé
            </MuiButton>
          )}
          {(selectedInvoice?.status === 1 || selectedInvoice?.status === 2) &&
            record.status === 1 && (
              <MuiButton
                color="error"
                onClick={() => handleCancelTicket(record.id)}
              >
                Hủy vé
              </MuiButton>
            )}
          {selectedInvoice?.status === 2 && (record.status === 1 || record.status === 4 )&& (
            <MuiButton
              color="secondary"
              onClick={() => handlePrint(record.id)}
            >
              In vé
            </MuiButton>
          )}
        </div>
      ),
    },
  ];

  const renderChangeTicketModal = () => (
    <Modal
      open={isChangeTicketModalVisible}
      onClose={handleChangeTicketModalClose}
      aria-labelledby="change-ticket-modal"
      aria-describedby="modal-to-change-ticket"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Đổi vé
        </Typography>
        <div className="rounded-[0.4rem] border border-[#EF5222]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 py-4 md:px-10 mb-[35px]">
            <Select
              options={filteredDepartures}
              value={departure?.value || null}
              onChange={(value, option) => setDeparture({ value, label: option.children })}
              placeholder="Điểm đi"
              className="w-full text-lg"
              classNamePrefix="select"
              isSearchable
              dropdownStyle={{ zIndex: 1500 }}
            />
            <Select
              options={filteredDestinations}
              value={destination?.value || null}
              onChange={(value, option) => setDestination({ value, label: option.children })}
              placeholder="Điểm đến"
              className="w-full text-lg"
              classNamePrefix="select"
              isSearchable
              dropdownStyle={{ zIndex: 1500 }}
            />
            <Input
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
          <Button
            onClick={handleSearch}
            className="bg-[#EF5222] text-white px-[77px] py-3 rounded-full font-semibold hover:brightness-105 shadow-lg"
          >
            Tìm chuyến xe
          </Button>
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
                  {/* <h3 className="font-semibold text-xl mb-6">
                    {routeTitle || "Vui lòng tìm kiếm chuyến xe"}
                  </h3> */}
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
                          <Button
                            onClick={() => handleConfirmChangeTicket(trip)}
                            className="bg-orange-100 text-orange-500 px-4 py-1 rounded-full text-[15px] font-medium"
                          >
                            Chọn chuyến
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );

  const renderSeatSelectionModal = () => (
    <Modal
      open={isSeatSelectionModalVisible}
      onClose={handleSeatSelectionModalClose}
      aria-labelledby="seat-selection-modal"
      aria-describedby="modal-to-select-seat"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chọn ghế mới
        </Typography>
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
                        !bookedSeats.includes(seat) && handleSeatSelection(seat)
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
                        !bookedSeats.includes(seat) && handleSeatSelection(seat)
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
        <Box className="mt-4 flex justify-end gap-2">
          <MuiButton onClick={handleSeatSelectionModalClose} variant="outlined">
            Hủy
          </MuiButton>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={handleConfirmSeatSelection}
            disabled={selectedSeats.length === 0}
          >
            Xác nhận đổi ghế
          </MuiButton>
        </Box>
      </Box>
    </Modal>
  );

  const renderBankDetailsModal = () => (
    <Modal
      open={showBankForm}
      onClose={() => {
        setShowBankForm(false);
        setBankDetails({ bankAccountNumber: "", bankName: "" });
      }}
      aria-labelledby="bank-details-modal"
      aria-describedby="modal-to-enter-bank-details"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Nhập thông tin ngân hàng
        </Typography>
        <div className="grid grid-cols-1 gap-4 text-sm text-gray-800">
          <div>
            <label className="block text-gray-500 mb-1">Tên ngân hàng:</label>
            <Select
              style={{ width: "100%" }}
              value={bankDetails.bankName}
              onChange={(value) => handleBankDetailsChange("bankName", value)}
              placeholder="Chọn ngân hàng"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children &&
                typeof option.children === "string" &&
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {Array.isArray(bankList) && bankList.length > 0 ? (
                bankList
                  .filter((bank) => bank.isTransfer === 1)
                  .map((bank) => (
                    <Select.Option key={bank.code} value={bank.code}>
                      {bank.shortName && bank.name
                        ? `${bank.shortName} - ${bank.name}`
                        : bank.name || bank.shortName || "Ngân hàng không xác định"}
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
        <Box className="mt-4 flex justify-end gap-2">
          <MuiButton
            onClick={() => {
              setShowBankForm(false);
              setBankDetails({ bankAccountNumber: "", bankName: "" });
            }}
            variant="outlined"
          >
            Hủy
          </MuiButton>
          <MuiButton
            variant="contained"
            color="primary"
            onClick={handleBankDetailsSubmit}
          >
            Lưu
          </MuiButton>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <div className="flex">
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="px-6 pt-6 pb-2">
          <Box sx={{ padding: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Danh sách hóa đơn
                </Typography>
                <div className="button-group mb-4">
                  <Popover
                    placement="bottomRight"
                    content={
                      <FilterButtonInvoice
                        onClose={() => setOpenFormFilter(false)}
                        onSubmit={onSubmitPopover}
                      />
                    }
                    title="Lọc Hóa Đơn"
                    trigger="click"
                    open={openFormFilter}
                    onOpenChange={setOpenFormFilter}
                  >
                    <Button className="filter-button">
                      Lọc <FilterOutlined />
                    </Button>
                  </Popover>
                </div>
                <Table
                  columns={getColumns()}
                  dataSource={filteredInvoiceList}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Modal xác nhận xóa */}
          <Modal
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Xác nhận xóa
              </Typography>
              <Typography>
                Bạn có chắc muốn xóa hóa đơn của khách hàng{" "}
                <strong>{invoiceToDelete?.name}</strong>?
              </Typography>
              <Box className="mt-4 flex justify-end gap-2">
                <MuiButton
                  onClick={() => setConfirmDeleteOpen(false)}
                  variant="outlined"
                >
                  Hủy
                </MuiButton>
                <MuiButton
                  variant="contained"
                  color="error"
                  onClick={confirmDelete}
                >
                  Xóa
                </MuiButton>
              </Box>
            </Box>
          </Modal>

          {/* Modal cập nhật hóa đơn */}
          <Modal
            open={updateModalOpen}
            onClose={() => {
              setUpdateModalOpen(false);
              setTickets([]);
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Cập nhật hóa đơn
              </Typography>
              {selectedInvoice && (
                <form onSubmit={handleUpdateSubmit}>
                  <TextField
                    fullWidth
                    label="ID hóa đơn"
                    name="id"
                    value={selectedInvoice.id || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tên khách hàng"
                    name="name"
                    value={selectedInvoice.name || ""}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={selectedInvoice.phone || ""}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={selectedInvoice.email || ""}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Số lượng vé"
                    name="numberOfTickets"
                    type="number"
                    value={selectedInvoice.numberOfTickets || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tổng tiền"
                    name="totalAmount"
                    type="number"
                    value={selectedInvoice.totalAmount || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Trạng thái"
                    name="status"
                    select
                    SelectProps={{ native: true }}
                    value={selectedInvoice.status || 0}
                    onChange={handleInputChange}
                    margin="normal"
                  >
                    <option value={0}>Đã hủy</option>
                    <option value={1}>Chờ thanh toán</option>
                    <option value={2}>Đã thanh toán</option>
                    <option value={3}>Thành công</option>
                  </TextField>

                  <Typography variant="h6" gutterBottom className="mt-4">
                    Danh sách vé
                  </Typography>
                  <Table
                    columns={ticketColumns}
                    dataSource={tickets}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />

                  <Box className="mt-4 flex justify-end gap-2">
                    <MuiButton
                      onClick={() => {
                        setUpdateModalOpen(false);
                        setTickets([]);
                      }}
                      variant="outlined"
                    >
                      Hủy
                    </MuiButton>
                    <MuiButton type="submit" variant="contained" color="primary">
                      Lưu
                    </MuiButton>
                  </Box>
                </form>
              )}
            </Box>
          </Modal>

          {/* Modal xem chi tiết hóa đơn */}
          <Modal
            open={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false);
              setTickets([]);
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Chi tiết hóa đơn
              </Typography>
              {selectedInvoice && (
                <>
                  <TextField
                    fullWidth
                    label="ID hóa đơn"
                    name="id"
                    value={selectedInvoice.id || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tên khách hàng"
                    name="name"
                    value={selectedInvoice.name || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={selectedInvoice.phone || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={selectedInvoice.email || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Số lượng vé"
                    name="numberOfTickets"
                    type="number"
                    value={selectedInvoice.numberOfTickets || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Tổng tiền"
                    name="totalAmount"
                    type="number"
                    value={selectedInvoice.totalAmount || ""}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Trạng thái"
                    name="status"
                    select
                    SelectProps={{ native: true }}
                    value={selectedInvoice.status || 0}
                    disabled
                    margin="normal"
                  >
                    <option value={0}>Đã hủy</option>
                    <option value={1}>Chờ thanh toán</option>
                    <option value={2}>Đã thanh toán</option>
                    <option value={3}>Thành công</option>
                  </TextField>

                  <Typography variant="h6" gutterBottom className="mt-4">
                    Danh sách vé
                  </Typography>
                  <Table
                    columns={ticketColumns}
                    dataSource={tickets}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />

                  <Box className="mt-4 flex justify-end">
                    <MuiButton
                      onClick={() => {
                        setViewModalOpen(false);
                        setTickets([]);
                      }}
                      variant="outlined"
                    >
                      Đóng
                    </MuiButton>
                  </Box>
                </>
              )}
            </Box>
          </Modal>

          {renderChangeTicketModal()}
          {renderSeatSelectionModal()}
          {renderBankDetailsModal()}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;