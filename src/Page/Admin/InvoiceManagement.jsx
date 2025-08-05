import { Table, Popover, Button, Input, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllInvoices, getAllInvoicesId, handleFilterInvoices } from "../../services/InvoiceService";
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
          <Select.Option value="0">Chưa thanh toán</Select.Option>
          <Select.Option value="1">Đã thanh toán</Select.Option>
          <Select.Option value="2">Đã hủy</Select.Option>
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

  useEffect(() => {
    fetchInvoices();
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

  const fetchTickets = async (invoiceId) => {
    try {
      const response = await getAllInvoicesId(invoiceId);
      setTickets(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vé");
      console.error("Fetch tickets error:", error);
    }
  };

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
      toast.success("Cập nhật hóa đơn thành công (mô phỏng)");
      setUpdateModalOpen(false);
      setSelectedInvoice(null);
      setTickets([]);
      fetchInvoices();
    } catch (error) {
      toast.error("Lỗi khi cập nhật hóa đơn");
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
            return "Chưa thanh toán";
          case 1:
            return "Đã thanh toán";
          case 2:
            return "Đã hủy";
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
            return "Chưa sử dụng";
          case 1:
            return "Đã sử dụng";
          case 2:
            return "Đã hủy";
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
                    label="Trạng thái"
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
                    rowKey="ticketId"
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
                    rowKey="ticketId"
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