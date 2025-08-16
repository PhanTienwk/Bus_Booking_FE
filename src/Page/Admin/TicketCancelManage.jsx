import { Table, Popover, Button, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllInvoicesId, updateInvoice } from "../../services/InvoiceService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  handleGetAllTicket,
  handleUpdateTicketStatus,
  handleFilterTickets,
} from "../../services/ticketService";
import { handleGetAllBank } from "../../services/BankDetailService";
import FilterButtonTicketCancel from "../../components/Button/FilterButtonTicketCancel";
import {
  Typography,
  Modal,
  Box,
  Button as MuiButton,
  Card,
  CardContent,
  TextField,
} from "@mui/material";

const AdminLayout = () => {
  const [ticketList, setTicketList] = useState([]);
  const [filteredTicketList, setFilteredTicketList] = useState([]);
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
    seatName: "",
    bankAccountNumber: "",
  });
  const [banks, setBanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBanks();
    fetchTickets();
  }, []);

  useEffect(() => {
    setFilteredTicketList(ticketList);
  }, [ticketList]);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await handleGetAllTicket();
      const validTickets = response.result.filter(
        (ticket) => ticket?.invoice?.user
      );
      setTicketList(validTickets);
      if (response.result.length !== validTickets.length) {
        console.warn("Một số vé có dữ liệu không hợp lệ!");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vé");
      console.error("Lỗi khi lấy vé:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await handleGetAllBank();
      if (response.code === 1000) {
        setBanks(response.result || []);
      } else {
        toast.error("Lỗi khi tải danh sách ngân hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách ngân hàng");
      console.error("Fetch banks error:", error);
    }
  };

  const fetchInvoiceTickets = async (invoiceId) => {
    try {
      const response = await getAllInvoicesId(invoiceId);
      setTickets(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vé của hóa đơn");
      console.error("Fetch invoice tickets error:", error);
    }
  };

  const confirmDelete = async () => {
    toast.success("Đã xóa hóa đơn (mô phỏng)");
    setConfirmDeleteOpen(false);
    setInvoiceToDelete(null);
    fetchTickets();
  };

  const handleUpdate = (ticket) => {
    setSelectedInvoice(ticket.invoice);
    fetchInvoiceTickets(ticket.invoice.id);
    setUpdateModalOpen(true);
  };

  const handleView = (ticket) => {
    setSelectedInvoice(ticket.invoice);
    fetchInvoiceTickets(ticket.invoice.id);
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
        // Update ticketList to reflect updated invoice data
        setFilteredTicketList((prev) =>
          prev.map((ticket) =>
            ticket.invoice.id === updatedInvoice.id
              ? { ...ticket, invoice: { ...ticket.invoice, ...updatedInvoice } }
              : ticket
          )
        );
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
      const response = await handleFilterTickets(filterData);
      if (response.code === 1000) {
        setFilterParams(filterData);
        setFilteredTicketList(response.result || []);
        toast.success("Lọc vé thành công!");
      } else {
        toast.error(response.message || "Lọc vé thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi lọc vé!");
      console.error("Filter tickets error:", error);
    }
    setOpenFormFilter(false);
  };

  const handleSelectStatus = async (value, record) => {
    try {
      const response = await handleUpdateTicketStatus(record.id, value);
      if (response.code === 1000) {
        toast.success("Cập nhật trạng thái vé thành công!");
        // Update ticket status in state
        setFilteredTicketList((prev) =>
          prev.map((ticket) =>
            ticket.id === record.id ? { ...ticket, status: value } : ticket
          )
        );
        const responseticket = await handleGetAllTicket();
        const validTickets = responseticket.result.filter(
          (ticket) => ticket?.invoice?.user
        );
        setTicketList(validTickets);
        // Update tickets in modal if open
        if (selectedInvoice && selectedInvoice.id === record.invoice.id) {
          setTickets((prev) =>
            prev.map((ticket) =>
              ticket.id === record.id ? { ...ticket, status: value } : ticket
            )
          );
        }
      } else {
        toast.error(response.message || "Cập nhật trạng thái vé thất bại!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái vé!"
      );
      console.error("Update ticket status error:", error);
    }
  };

  const getColumns = () => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      render: (_, record) => record?.invoice?.user?.name ?? "Không xác định",
      key: "name",
    },
    {
      title: "Số điện thoại",
      render: (_, record) => record?.invoice?.phone ?? "Không xác định",
      key: "phone",
    },
    {
      title: "Email",
      render: (_, record) => record?.invoice?.email ?? "Không xác định",
      key: "email",
    },
    {
      title: "Ngân hàng",
      key: "bank",
      render: (_, record) => {
        const bank = banks.find(
          (bank) => bank.invoice.id === record.invoice.id
        );
        return bank
          ? `${bank.bankName} (${bank.bankAccountNumber})`
          : "Không có thông tin";
      },
    },
    {
      title: "Số lượng vé",
      render: (_, record) => record?.invoice?.numberOfTickets || 0,
      key: "numberOfTickets",
    },
    {
      title: "Tổng tiền",
      render: (_, record) =>
        record?.invoice?.totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }) || "0 đ",
      key: "totalAmount",
    },
    {
      title: "Trạng thái vé",
      key: "updateStatus",
      render: (_, record) => (
        <Select
          style={{ width: 150 }}
          value={record.status !== undefined ? record.status : 0}
          onChange={(value) => handleSelectStatus(value, record)}
        >
          <Select.Option value={0}>Đã hủy</Select.Option>
          <Select.Option value={5}>Chờ xử lý hủy</Select.Option>
        </Select>
      ),
    },
  ];

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
      render: (_, record) =>
        record?.seatPosition?.bus?.name || "Không xác định",
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
  ];

  return (
    <div className="flex">
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="px-6 pt-6 pb-2">
          <Box sx={{ padding: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Danh sách vé
                </Typography>
                <div className="button-group mb-4">
                  <Popover
                    placement="bottomRight"
                    content={
                      <FilterButtonTicketCancel
                        onClose={() => setOpenFormFilter(false)}
                        onSubmit={onSubmitPopover}
                      />
                    }
                    title="Lọc Vé"
                    trigger="click"
                    open={openFormFilter}
                    onOpenChange={setOpenFormFilter}
                  >
                    <Button className="filter-button">
                      Lọc <FilterOutlined />
                    </Button>
                  </Popover>
                </div>
                {isLoading ? (
                  <Typography>Đang tải dữ liệu...</Typography>
                ) : (
                  <Table
                    columns={getColumns()}
                    dataSource={filteredTicketList}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                )}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Tổng tiền"
                    name="totalAmount"
                    type="number"
                    value={selectedInvoice.totalAmount || ""}
                    onChange={handleInputChange}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    fullWidth
                    label="Trạng thái hóa đơn"
                    name="status"
                    select
                    SelectProps={{ native: true }}
                    value={selectedInvoice.status || 0}
                    onChange={handleInputChange}
                    margin="normal"
                  >
                    <option value={0}>Chưa thanh toán</option>
                    <option value={1}>Đã thanh toán</option>
                    <option value={2}>Đã hủy</option>
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
                    <MuiButton
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
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
                    label="Trạng thái hóa đơn"
                    name="status"
                    select
                    SelectProps={{ native: true }}
                    value={selectedInvoice.status || 0}
                    disabled
                    margin="normal"
                  >
                    <option value={0}>Chưa thanh toán</option>
                    <option value={1}>Đã thanh toán</option>
                    <option value={2}>Đã hủy</option>
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
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
