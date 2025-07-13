import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { getAllBusTrips } from "../../services/UserService";
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

const BusTripPage = () => {
  const username = "Admin Dũng";

  const [tripList, setTripList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await getAllBusTrips();
      setTripList(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách chuyến xe");
      console.error("Fetch trip error:", error);
    }
  };

  const handleDelete = (trip) => {
    setTripToDelete(trip);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    toast.success("Đã xóa chuyến xe (mô phỏng)");
    setConfirmDeleteOpen(false);
    setTripToDelete(null);
  };

  const getColumns = () => [
    {
      title: "Tuyến xe",
      key: "route",
      render: (_, record) => {
        const from = record.busRoute?.busStationFrom?.name || "N/A";
        const to = record.busRoute?.busStationTo?.name || "N/A";
        return `${from} → ${to}`;
      },
    },
    {
      title: "Thời gian khởi hành",
      dataIndex: "departureTime",
      key: "departureTime",
      render: (time) =>
        time ? new Date(time).toLocaleString("vi-VN") : "Không xác định",
    },
    {
      title: "Giá vé",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Chi phí vận hành",
      dataIndex: "costOperating",
      key: "costOperating",
    },
    {
      title: "Chi phí phát sinh",
      dataIndex: "costIncurred",
      key: "costIncurred",
    },
    {
      title: "Tài xế",
      key: "driver",
      render: (_, record) => record.user?.name || "Không có",
    },
    {
      title: "Xe",
      key: "bus",
      render: (_, record) => record.bus?.licensePlate || "Không có",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return "Chưa chạy";
          case 1:
            return "Đang chạy";
          case 2:
            return "Hoàn thành";
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
                  Danh sách chuyến xe
                </Typography>
                <Table
                  columns={getColumns()}
                  dataSource={tripList}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </CardContent>
            </Card>
          </Box>

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
                Bạn có chắc muốn xóa chuyến xe{" "}
                <strong>
                  {tripToDelete?.bus?.licensePlate || "Không xác định"}
                </strong>
                ?
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

export default BusTripPage;
