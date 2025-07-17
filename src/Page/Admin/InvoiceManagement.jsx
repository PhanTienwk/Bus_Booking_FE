import AdminTopbar from "../../components/AdminTopbar";
import { Table } from "antd";
import { useEffect, useState } from "react";
import {
  getAllInvoices
} from "../../services/UserService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Modal,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";

const AdminLayout = () => {
  const username = "Admin Dũng";

  const [invoiceList, setInvoiceList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getAllInvoices();
      setInvoiceList(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vé");
      console.error("Fetch invoice error:", error);
    }
  };

  const handleDelete = (invoice) => {
    setInvoiceToDelete(invoice);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    // Giả sử bạn có API xóa hóa đơn tại đây
    toast.success("Đã xóa vé (mô phỏng)");
    setConfirmDeleteOpen(false);
    setInvoiceToDelete(null);
  };

  const getColumns = () => [
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
        <Button
          color="error"
          onClick={() => handleDelete(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="flex">
      {/* <AdminSidebar /> */}
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />

        <div className="px-6 pt-6 pb-2">
          <Box sx={{ padding: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Danh sách vé xe
                </Typography>
                <Table
                  columns={getColumns()}
                  dataSource={invoiceList}
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
                Bạn có chắc muốn xóa vé của khách hàng{" "}
                <strong>{invoiceToDelete?.name}</strong>?
              </Typography>

              <Box className="mt-4 flex justify-end gap-2">
                <Button
                  onClick={() => setConfirmDeleteOpen(false)}
                  variant="outlined"
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={confirmDelete}
                >
                  Xóa
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
