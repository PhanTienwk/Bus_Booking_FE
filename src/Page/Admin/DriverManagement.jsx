import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/UserService";

const AdminLayout = () => {
  const username = "Admin Dũng";

  const [user] = useState({ roles: [{ role: "ADMIN" }] });

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const filteredUsers = response.result?.filter(user =>
      user.account?.role?.id === 2
    );
    setUserList(filteredUsers);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  // const handleToggleStatus = (id, checked) => {
  //   console.log(`Toggle status for bus station ID ${id}: ${checked}`);
  // };

  const handleUpdate = (record) => {
    console.log(`Update bus station:`, record);
  };

  const handleDelete = (id) => {
    console.log(`Delete bus station ID ${id}`);
  };

  const getColumns = () => {
    const role = user.roles?.[0]?.role || -1;

    const columns = [
      { title: "Avatar", dataIndex: "id", key: "id" },
      { title: "Tên", dataIndex: "name", key: "name" },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        render: (g) => (g === 1 ? "Nam" : "Nữ"),
      },
      {
        title: "Ngày sinh",
        dataIndex: "birthDate",
        key: "birthDate",
        render: (date) => {
          if (!date) return "Không có";
          const d = new Date(date);
          return d.toLocaleDateString("vi-VN");
        }
      },
      { title: "CCCD", dataIndex: "cccd", key: "cccd" },
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
            <Button onClick={() => handleDelete(record.id)}>
              Xóa
            </Button>
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
                  Danh sách tài xế
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
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
