import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { getAllBusRoutes } from "../../services/UserService";
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

const BusRoutePage = () => {
  const username = "Admin Dũng";

  const [routeList, setRouteList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  useEffect(() => {
    fetchBusRoutes();
  }, []);

  const fetchBusRoutes = async () => {
    try {
      const response = await getAllBusRoutes();
      setRouteList(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tuyến xe");
      console.error("Fetch route error:", error);
    }
  };

  const handleDelete = (route) => {
    setRouteToDelete(route);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    toast.success("Đã xóa tuyến xe (mô phỏng)");
    setConfirmDeleteOpen(false);
    setRouteToDelete(null);
  };

  const getColumns = () => [
    {
      title: "Bến đi",
      dataIndex: ["busStationFrom", "name"],
      key: "busStationFrom",
    },
    {
      title: "Bến đến",
      dataIndex: ["busStationTo", "name"],
      key: "busStationTo",
    },
    {
      title: "Khoảng cách (km)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Thời gian (giờ)",
      dataIndex: "travelTime",
      key: "travelTime",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return "Không hoạt động";
          case 1:
            return "Đang hoạt động";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button color="error" onClick={() => handleDelete(record)}>
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
                  Danh sách tuyến xe
                </Typography>
                <Table
                  columns={getColumns()}
                  dataSource={routeList}
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
                Bạn có chắc muốn xóa tuyến xe từ{" "}
                <strong>{routeToDelete?.busStationFrom?.name}</strong> đến{" "}
                <strong>{routeToDelete?.busStationTo?.name}</strong>?
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

export default BusRoutePage;
