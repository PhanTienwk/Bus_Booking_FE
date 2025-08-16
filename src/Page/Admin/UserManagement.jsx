import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import BusStationManage from "./BusStation";
import DriverManage from "./DriverManagement";
import InvoiceManage from "./InvoiceManagement";
import RouteManage from "./RouteManagement";
import BusTrip from "./BusTrip";
import LocationManage from "./LocationManagement";
import Statistic from "./Statistic";
import UserInformation from "./UserInformation";
import BusManage from "./Bus";
import TicketCanCelManage from "./TicketCancelManage";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Table,
  Modal,
  Popover,
  Switch,
  Select,
  Empty,
  Input,
  Button,
} from "antd";
import { PlusSquareOutlined, FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./BusStation.css";

import {
  getAllUsers,
  updateUserById,
  deleteUserById,
  restoreUserById,
  handleFilterUsers,
  handleAddUser,
} from "../../services/UserService";
import FilterButtonUser from "../../components/Button/FilterButtonUser";

const UserManagement = () => {
  const username = "Admin Dũng";
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setUserList] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [dataAdd, setDataAdd] = useState({
    nameAdd: "",
    genderAdd: "",
    cccdAdd: "",
    birtdayAdd: "",
    phoneAdd: "",
    emailAdd: "",
    passwordAdd: "",
  });
  const [modals, setModals] = useState({
    update: false,
    add: false,
    delete: false,
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await getAllUsers();
        console.log(usersRes);
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 1 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(filteredUsers);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách người dùng!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        handleOpenSnackBar("Lỗi khi tải dữ liệu người dùng!", "error");
      }
    };

    fetchData();
  }, []);

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const getColumns = () => {
    return [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Tên người dùng",
        dataIndex: "name",
        key: "name",
      },
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
      {
        title: "Trạng thái",
        key: "status",
        render: (_, record) => (
          <Switch
            checked={parseInt(record.account?.status) === 1}
            onChange={(checked) => handleToggleStatus(record.id, checked)}
          />
        ),
      },

      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <div>
            <Button type="primary" ghost onClick={() => handleUpdate(record)}>
              Cập nhật
            </Button>
          </div>
        ),
      },
    ];
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      let response;
      if (!checked) {
        response = await deleteUserById(id);
      } else {
        response = await restoreUserById(id);
      }

      if (response.code === 1000) {
        const usersRes = await getAllUsers();
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 1 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(filteredUsers);
          handleOpenSnackBar(
            checked
              ? "Khôi phục người dùng thành công!"
              : "Vô hiệu hóa người dùng thành công!",
            "success"
          );
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách người dùng!", "error");
        }
      } else {
        handleOpenSnackBar(
          response.message || "Cập nhật trạng thái người dùng thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái:",
        error.response?.data || error
      );
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái!",
        "error"
      );
    }
  };

  const handleUpdate = (record) => {
    let genderLabel = "";
    switch (record.gender) {
      case 1:
        genderLabel = "Nam";
        break;
      case 2:
        genderLabel = "Nữ";
        break;
      case 3:
        genderLabel = "Khác";
        break;
      default:
        genderLabel = "";
    }

    let formattedDob = "";
    if (record.birthDate) {
      const date = new Date(record.birthDate);
      const localDate = new Date(
        date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
      );
      formattedDob = localDate.toISOString().split("T")[0];
    }

    setSelectedUser({
      ...record,
      email: record.account?.username || "",
      gender: genderLabel,
      dob: formattedDob,
    });

    setModals({ ...modals, update: true });
  };

  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  // Xử lý thay đổi input trong modal cập nhật
  const handleOnChangeInput = (id, event) => {
    const value = event.target.value;
    setSelectedUser({ ...selectedUser, [id]: value });
  };

  const handleOnChangeInputAdd = (id, event) => {
    const value = event.target.value;
    setDataAdd({ ...dataAdd, [id]: value });
  };

  const handleSelectChange = (id, value) => {
    setDataAdd({ ...dataAdd, [id]: value });
  };

  const onSubmitPopover = async (filterData) => {
    try {
      const response = await handleFilterUsers(filterData);
      if (response.code === 1000) {
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc người dùng thành công!", "success");
      } else {
        handleOpenSnackBar(response.message || "Lọc thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc người dùng:", error.response?.data || error);
      handleOpenSnackBar("Lỗi khi lọc người dùng!", "error");
    }
    setOpenFormFilter(false);
  };

  const handleOkAdd = async () => {
    try {
      if (
        !dataAdd.nameAdd ||
        !dataAdd.genderAdd ||
        !dataAdd.birtdayAdd ||
        !dataAdd.phoneAdd ||
        !dataAdd.emailAdd ||
        !dataAdd.cccdAdd
      ) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }
      if (!/^\d{12}$/.test(dataAdd.cccdAdd)) {
        handleOpenSnackBar("CCCD phải gồm 12 chữ số!", "error");
        return;
      }
      if (!/^\d{10}$/.test(dataAdd.phoneAdd)) {
        handleOpenSnackBar("Số điện thoại phải gồm 10 chữ số!", "error");
        return;
      }

      const payload = {
        name: dataAdd.nameAdd,
        gender: dataAdd.genderAdd,
        cccd: dataAdd.cccdAdd,
        birthDate: dataAdd.birtdayAdd,
        phone: dataAdd.phoneAdd,
        email: dataAdd.emailAdd,
        password: dataAdd.passwordAdd,
      };

      console.log("Payload for add user:", payload);

      // const addRes = await handleAddUser(payload);
      // if (addRes.code === 1000) {
      //   const usersRes = await getAllUsers();
      //   if (usersRes.code === 1000) {
      //     setData(usersRes.result);
      //     setFilteredData(usersRes.result);
      //     handleOpenSnackBar("Thêm người dùng thành công!", "success");
      //   } else {
      //     handleOpenSnackBar("Lỗi khi tải danh sách người dùng!", "error");
      //   }
      // } else {
      //   handleOpenSnackBar(
      //     addRes.message || "Thêm người dùng thất bại!",
      //     "error"
      //   );
      // }

      // setModals({ ...modals, add: false });
      // setDataAdd({
      //   nameAdd: "",
      //   genderAdd: "",
      //   dobAdd: "",
      //   phoneAdd: "",
      //   emailAdd: "",
      // });

      const addresponse = await handleAddUser(payload);

      if (addresponse.code === 200) {
        const usersRes = await getAllUsers();
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 1 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(usersRes.result);
          handleOpenSnackBar("Thêm người dùng thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách người dùng!", "error");
        }
      } else {
        handleOpenSnackBar("Thêm người dùng thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm người dùng!",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  const handleOkUpdate = async () => {
    if (!selectedUser.name || selectedUser.name.trim() === "") {
      handleOpenSnackBar("Tên không được để trống!", "error");
      return;
    }

    if (!selectedUser.birthDate) {
      handleOpenSnackBar("Ngày sinh không được để trống!", "error");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!selectedUser.phone || !phoneRegex.test(selectedUser.phone)) {
      handleOpenSnackBar(
        "Số điện thoại phải có 10–11 chữ số và không chứa ký tự đặc biệt!",
        "error"
      );
      return;
    }

    try {
      const userId = selectedUser?.id;

      const genderNumber =
        selectedUser.gender === "Nam"
          ? 1
          : selectedUser.gender === "Nữ"
          ? 2
          : selectedUser.gender === "Khác"
          ? 3
          : null;

      const formattedBirthDate = selectedUser.dob
        ? selectedUser.dob.includes("T")
          ? selectedUser.dob
          : `${selectedUser.dob}T00:00:00`
        : null;

      const payload = {
        name: selectedUser.name,
        gender: genderNumber,
        birthDate: formattedBirthDate,
        phone: selectedUser.phone,
      };

      const updateRes = await updateUserById(userId, payload);

      if (updateRes.code === 1000) {
        const usersRes = await getAllUsers();
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 1 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(usersRes.result);
          handleOpenSnackBar("Cập nhật người dùng thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách người dùng!", "error");
        }
      } else {
        handleOpenSnackBar("Cập nhật người dùng thất bại!", "error");
      }

      setModals({ ...modals, update: false });
      setSelectedUser(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      handleOpenSnackBar("Lỗi khi cập nhật người dùng!", "error");
      setModals({ ...modals, update: false });
      setSelectedUser(null);
    }
  };

  const handleOkDelete = () => {
    handleOpenSnackBar("Chức năng xóa chưa được triển khai!", "error");
    setModals({ ...modals, delete: false });
  };

  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="nameAdd" className="form-label">
              Họ và tên <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="nameAdd"
              placeholder="Nhập họ và tên"
              value={dataAdd.nameAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="genderAdd" className="form-label">
              Giới tính <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="genderAdd"
              className="w-100"
              placeholder="Chọn giới tính"
              value={dataAdd.genderAdd || undefined}
              onChange={(value) => handleSelectChange("genderAdd", value)}
              options={[
                { label: "Nam", value: "1" },
                { label: "Nữ", value: "2" },
                { label: "Khác", value: "3" },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="emailAdd" className="form-label">
              CCCD: <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="cccdAdd"
              placeholder="Nhập căn cước công dân"
              value={dataAdd.cccdAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="birtdayAdd" className="form-label">
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="birtdayAdd"
              type="date"
              value={dataAdd.birtdayAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="phoneAdd" className="form-label">
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="phoneAdd"
              placeholder="Nhập số điện thoại"
              value={dataAdd.phoneAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="emailAdd" className="form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="emailAdd"
              placeholder="Nhập email"
              value={dataAdd.emailAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="passwordAdd" className="form-label">
              Mật khẩu <span style={{ color: "red" }}>*</span>
            </label>
            <Input.Password
              id="passwordAdd"
              placeholder="Nhập mật khẩu"
              value={dataAdd.passwordAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  const UpdateModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Họ và tên <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="name"
              placeholder="Nhập họ và tên"
              value={selectedUser?.name || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">
              Giới tính <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="gender"
              className="w-100"
              placeholder="Chọn giới tính"
              value={selectedUser?.gender || undefined}
              onChange={(value) =>
                setSelectedUser({
                  ...selectedUser,
                  gender: value,
                })
              }
              options={[
                { label: "Nam", value: "Nam" },
                { label: "Nữ", value: "Nữ" },
                { label: "Khác", value: "Khác" },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="dob" className="form-label">
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="dob"
              type="date"
              value={selectedUser?.dob || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              value={selectedUser?.phone || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="email"
              placeholder="Nhập email"
              value={selectedUser?.email || ""}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeIndex) {
      case 1:
        return <DriverManage />;
      case 2:
        return <InvoiceManage />;
      case 3:
        return <TicketCanCelManage />;
      case 4:
        return <RouteManage />;
      case 5:
        return <BusTrip />;
      case 6:
        return <BusStationManage />;
      case 7:
        return <BusManage />;
      case 8:
        return <LocationManage />;
      case 9:
        return <Statistic />;
      case 10:
        return <UserInformation />;
      case 0:
      default:
        return (
          <Box sx={{ padding: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  QUẢN LÝ NGƯỜI DÙNG
                </Typography>
                <div className="button-group">
                  <Button
                    className="button-add"
                    size="large"
                    onClick={() => toggleModal("add", true)}
                  >
                    <PlusSquareOutlined /> Tạo mới
                  </Button>
                  <Popover
                    placement="bottomRight"
                    content={
                      <div style={{ width: 400 }}>
                        <FilterButtonUser
                          onClose={() => setOpenFormFilter(false)}
                          onSubmit={onSubmitPopover}
                        />
                      </div>
                    }
                    title="Lọc Người Dùng"
                    trigger="click"
                    open={openFormFilter}
                    onOpenChange={setOpenFormFilter}
                    destroyOnHidden={false}
                  >
                    <Button className="filter-button">
                      Lọc <FilterOutlined />
                    </Button>
                  </Popover>
                </div>
                {filteredData.length === 0 ? (
                  <Empty />
                ) : (
                  <Table
                    columns={getColumns()}
                    dataSource={filteredData}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                  />
                )}
              </CardContent>
            </Card>

            <Modal
              title="Thêm Người Dùng"
              open={modals.add}
              onOk={handleOkAdd}
              onCancel={() => toggleModal("add", false)}
              width={800}
            >
              {AddModal}
            </Modal>

            <Modal
              title="Xác Nhận Xóa"
              open={modals.delete}
              onOk={handleOkDelete}
              onCancel={() => toggleModal("delete", false)}
            >
              Xác nhận xóa người dùng?
            </Modal>

            <Modal
              title="Cập Nhật Người Dùng"
              open={modals.update}
              onOk={handleOkUpdate}
              onCancel={() => toggleModal("update", false)}
              width={800}
            >
              {selectedUser ? UpdateModal : <p>Đang tải...</p>}
            </Modal>

            <Snackbar
              open={snackBar.open}
              autoHideDuration={3000}
              onClose={handleCloseSnackBar}
            >
              <Alert
                onClose={handleCloseSnackBar}
                severity={snackBar.severity}
                sx={{ width: "100%" }}
              >
                {snackBar.message}
              </Alert>
            </Snackbar>
          </Box>
        );
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />
        {renderContent()}
      </main>
    </div>
  );
};

export default UserManagement;
