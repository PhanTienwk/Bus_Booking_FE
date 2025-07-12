import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { getAllProvinces } from "../../services/UserService";
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

const ProvincePage = () => {
  const username = "Admin Dũng";

  const [provinceList, setProvinceList] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [provinceToDelete, setProvinceToDelete] = useState(null);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await getAllProvinces();
      setProvinceList(response.result || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tỉnh");
      console.error("Fetch province error:", error);
    }
  };

  const handleDelete = (province) => {
    setProvinceToDelete(province);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    toast.success("Đã xóa tỉnh (mô phỏng)");
    setConfirmDeleteOpen(false);
    setProvinceToDelete(null);
  };

  const getColumns = () => [
    {
      title: "Tên tỉnh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === 1 ? "Đang hoạt động" : "Ngừng hoạt động",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) =>
        value ? new Date(value).toLocaleDateString("vi-VN") : "N/A",
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
      <AdminSidebar />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />
        <div className="px-6 pt-6 pb-2">
          <Box>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Danh sách tỉnh thành
                </Typography>
                <Table
                  columns={getColumns()}
                  dataSource={provinceList}
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
                Bạn có chắc muốn xóa tỉnh{" "}
                <strong>{provinceToDelete?.name}</strong>?
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

export default ProvincePage;
