import {
  Box,
  Button,
  Card,
  CardContent,
  // Divider,
  // TextField,
  Typography,
  // Snackbar,
  // Alert,
} from "@mui/material";
import {
  Table,
  // Modal,
  // Image,
  // Upload,
  // Empty,
  // Popover,
  Switch,
  // Select,
} from "antd";

// import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Login() {
  // const navigate = useNavigate();
  const [user] = useState({ roles: [{ role: "ADMIN" }] }); // Sample user role for testing (can be "CUSTOMER" to test role-based rendering)

  // Mock data (unchanged)
  // const mockProvinces = [
  //   {
  //     id: 1,
  //     name: "Hà Nội",
  //     status: 1,
  //     created_at: "2025-07-01T09:00:00.000Z",
  //     updated_at: "2025-07-01T09:00:00.000Z",
  //   },
  //   {
  //     id: 2,
  //     name: "TP. Hồ Chí Minh",
  //     status: 1,
  //     created_at: "2025-07-01T09:00:00.000Z",
  //     updated_at: "2025-07-01T09:00:00.000Z",
  //   },
  //   {
  //     id: 3,
  //     name: "Đà Nẵng",
  //     status: 1,
  //     created_at: "2025-07-01T09:00:00.000Z",
  //     updated_at: "2025-07-01T09:00:00.000Z",
  //   },
  // ];

  const mockBusStations = [
    {
      id: 1,
      name: "Bến xe Giáp Bát",
      address: "123 Đường Láng, Hà Nội",
      phone: "0912345679",
      status: 1,
      created_at: "2025-07-01T09:00:00.000Z",
      updated_at: "2025-07-01T09:00:00.000Z",
      id_province: 1,
      province: { id: 1, name: "Hà Nội" },
    },
    {
      id: 2,
      name: "Bến xe Miền Đông",
      address: "456 Lê Lợi, TP. HCM",
      phone: "0987654322",
      status: 1,
      created_at: "2025-07-01T09:00:00.000Z",
      updated_at: "2025-07-01T09:00:00.000Z",
      id_province: 2,
      province: { id: 2, name: "TP. Hồ Chí Minh" },
    },
    {
      id: 3,
      name: "Bến xe Đà Nẵng",
      address: "789 Tôn Đức Thắng, Đà Nẵng",
      phone: "0901234568",
      status: 1,
      created_at: "2025-07-01T09:00:00.000Z",
      updated_at: "2025-07-01T09:00:00.000Z",
      id_province: 3,
      province: { id: 3, name: "Đà Nẵng" },
    },
    {
      id: 4,
      name: "Bến xe Nước Ngầm",
      address: "99 Ngọc Hồi, Hà Nội",
      phone: "0932145679",
      status: 0,
      created_at: "2025-07-01T09:00:00.000Z",
      updated_at: "2025-07-01T09:00:00.000Z",
      id_province: 1,
      province: { id: 1, name: "Hà Nội" },
    },
  ];

  // useEffect for fetching user data (unchanged)
  // useEffect(() => {
  //   const fetchData = async () => {
  //     let res = await handleGetAllUserApi();
  //     console.log("resss data >>", res);
  //     // Optionally update user state with fetched data
  //     // setUser(res.data); // Uncomment if API returns user data
  //   };
  //   fetchData();
  // }, []);

  // useEffect for token-based navigation (unchanged)

  // Handle Snackbar close (unchanged)
  // const handleCloseSnackBar = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  // };

  // Placeholder functions for table actions
  const handleToggleStatus = (id, checked) => {
    console.log(`Toggle status for bus station ID ${id}: ${checked}`);
    // Implement status update logic here
  };

  const handleUpdate = (record) => {
    console.log(`Update bus station:`, record);
    // Implement update logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete bus station ID ${id}`);
    // Implement delete logic here
  };

  // Define table columns
  const getColumns = () => {
    const role = user.roles?.[0]?.role || -1;

    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Tên bến xe",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Tỉnh/Thành phố",
        dataIndex: ["province", "name"],
        key: "provinceName",
      },
      {
        title: "Trạng thái",
        key: "status",
        render: (_, record) => (
          <Switch
            checked={record.status === 1}
            onChange={(checked) => handleToggleStatus(record.id, checked)}
            disabled={role === "CUSTOMER"}
          />
        ),
      },
    ];

    if (role !== "CUSTOMER") {
      columns.push({
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <div>
            <Button
              type="primary"
              ghost
              onClick={() => handleUpdate(record)}
              style={{ marginRight: "10px" }}
            >
              Cập nhật
            </Button>
            <Button type="danger" ghost onClick={() => handleDelete(record.id)}>
              Xóa
            </Button>
          </div>
        ),
      });
    }

    return columns;
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Danh sách bến xe
          </Typography>
          <Table
            columns={getColumns()}
            dataSource={mockBusStations}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
