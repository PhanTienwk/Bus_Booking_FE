import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

import { Table } from "antd";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUserById,
  deleteUserById,
} from "../../services/UserService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Modal,
  Box,
  Button,
  Card,
  CardContent,
} from "@mui/material";

const AdminLayout = () => {
  const username = "Admin Dũng";

  const [user] = useState({ roles: [{ role: "ADMIN" }] });

  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const filteredUsers = response.result?.filter(
        (user) => user.account?.role?.id === 1 && user.account?.status === 1
      );
      setUserList(filteredUsers);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  const handleUpdate = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const formattedBirthDate = selectedUser.birthDate
        ? selectedUser.birthDate.includes("T")
          ? selectedUser.birthDate
          : `${selectedUser.birthDate}T00:00:00`
        : null;

      const payload = {
        name: selectedUser.name,
        phone: selectedUser.phone,
        gender: selectedUser.gender,
        birthDate: formattedBirthDate,
      };

      await updateUserById(selectedUser.id, payload);
      await fetchUsers();
      toast.success("Cập nhật thành công");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Cập nhật thất bại");
      console.error("Lỗi cập nhật:", error);
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserById(userToDelete.id);
      toast.success("Xóa người dùng thành công");
      await fetchUsers();
      setConfirmDeleteOpen(false);
    } catch (error) {
      toast.error("Xóa thất bại");
      console.error("Lỗi xóa:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  const getColumns = () => {
    const role = user.roles?.[0]?.role || -1;

    const columns = [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Tên", dataIndex: "name", key: "name" },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        render: (g) => {
          if (g === 1) return "Nam";
          if (g === 2) return "Nữ";
          if (g === 3) return "Khác";
          return "Không rõ";
        },
      },
      {
        title: "Ngày sinh",
        dataIndex: "birthDate",
        key: "birthDate",
        render: (date) => {
          if (!date) return "Không có";
          const d = new Date(date);
          return d.toLocaleDateString("vi-VN");
        },
      },
      { title: "SĐT", dataIndex: "phone", key: "phone" },
      {
        title: "Email",
        dataIndex: ["account", "username"],
        key: "username",
      },
    ];

    if (role !== "CUSTOMER") {
      columns.push({
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <div>
            <Button
              onClick={() => handleUpdate(record)}
              style={{ marginRight: "10px" }}
            >
              Cập nhật
            </Button>
            <Button onClick={() => handleDelete(record)}>Xóa</Button>
          </div>
        ),
      });
    }

    return columns;
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />

        <div className="px-6 pt-6 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
              <div>
                <p className="text-gray-500">Khách hàng</p>
                <p className="text-2xl font-semibold">11</p>
              </div>
              <img
                src="/images/customer.png"
                alt="icon customer"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
              <div>
                <p className="text-gray-500">Tổng số xe</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
              <img
                src="/images/bus.png"
                alt="icon bus"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
              <div>
                <p className="text-gray-500">Số chuyến xe</p>
                <p className="text-2xl font-semibold">10</p>
              </div>
              <img
                src="/images/bus-route.png"
                alt="icon bus-route"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="bg-white px-6 py-4 rounded shadow flex items-center justify-between">
              <div>
                <p className="text-gray-500">Tổng doanh thu</p>
                <p className="text-2xl font-semibold">0 đ</p>
              </div>
              <img
                src="/images/admin_image/money.png"
                alt="icon money"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          <Box sx={{ padding: 0 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Danh sách người dùng
                </Typography>
                <Table
                  columns={getColumns()}
                  dataSource={userList}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </CardContent>
            </Card>
          </Box>
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Cập nhật người dùng
              </Typography>

              {selectedUser && (
                <>
                  <TextField
                    fullWidth
                    label="Tên"
                    value={selectedUser.name || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                    margin="normal"
                  />

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={selectedUser.gender}
                      label="Giới tính"
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          gender: e.target.value,
                        })
                      }
                    >
                      <MenuItem value={1}>Nam</MenuItem>
                      <MenuItem value={2}>Nữ</MenuItem>
                      <MenuItem value={3}>Khác</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={
                      selectedUser.birthDate
                        ? new Date(selectedUser.birthDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        birthDate: e.target.value,
                      })
                    }
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={selectedUser.phone || ""}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedUser.account?.username || ""}
                    margin="normal"
                    disabled
                  />

                  <Box className="mt-4 flex justify-end gap-2">
                    <Button
                      onClick={() => setIsModalOpen(false)}
                      variant="outlined"
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Lưu
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Modal>

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
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <strong>{userToDelete?.name}</strong>?
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
