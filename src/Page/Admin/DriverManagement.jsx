import BusStationManage from "./BusStation";
import DriverManage from "./DriverManagement";
import InvoiceManage from "./InvoiceManagement";
import RouteManage from "./RouteManagement";
import TripManage from "./TripManagement";
import LocationManage from "./LocationManagement";
import UserInformation from "./UserInformation";
import BusManage from "./Bus";
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
  getAllDrivers,
  updateUserById,
  deleteUserById,
  restoreUserById,
  handleFilterDrivers,
} from "../../services/UserService";
import FilterButtonUser from "../../components/Button/FilterButtonUser";

const UserManagement = () => {
  const [activeIndex, ] = useState(0);
  const [, setUserList] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [dataAdd, setDataAdd] = useState({
    nameAdd: "",
    genderAdd: "",
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
        const usersRes = await getAllDrivers();

        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 2 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(filteredUsers);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tài xế!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        handleOpenSnackBar("Lỗi khi tải dữ liệu tài xế!", "error");
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
        title: "Tên tài xế",
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
        const usersRes = await getAllDrivers();
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 2 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(filteredUsers);
          handleOpenSnackBar(
            checked
              ? "Khôi phục tài xế thành công!"
              : "Vô hiệu hóa tài xế thành công!",
            "success"
          );
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tài xế!", "error");
        }
      } else {
        handleOpenSnackBar(
          response.message || "Cập nhật trạng thái tài xế thất bại!",
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

    setSelectedDriver({
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
    setSelectedDriver({ ...selectedDriver, [id]: value });
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
      const response = await handleFilterDrivers(filterData);
      if (response.code === 1000) {
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc tài xế thành công!", "success");
      } else {
        handleOpenSnackBar(response.message || "Lọc thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc tài xế:", error.response?.data || error);
      handleOpenSnackBar("Lỗi khi lọc tài xế!", "error");
    }
    setOpenFormFilter(false);
  };

  const handleOkAdd = async () => {
    try {
      if (
        !dataAdd.nameAdd ||
        !dataAdd.genderAdd ||
        !dataAdd.dobAdd ||
        !dataAdd.phoneAdd ||
        !dataAdd.emailAdd
      ) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }

      const payload = {
        name: dataAdd.nameAdd,
        gender: dataAdd.genderAdd,
        dob: dataAdd.dobAdd,
        phone: dataAdd.phoneAdd,
        email: dataAdd.emailAdd,
      };

      console.log("Payload for add user:", payload);

      // const addRes = await handleAddUser(payload);
      // if (addRes.code === 1000) {
      //   const usersRes = await getAllDrivers();
      //   if (usersRes.code === 1000) {
      //     setData(usersRes.result);
      //     setFilteredData(usersRes.result);
      //     handleOpenSnackBar("Thêm tài xế thành công!", "success");
      //   } else {
      //     handleOpenSnackBar("Lỗi khi tải danh sách tài xế!", "error");
      //   }
      // } else {
      //   handleOpenSnackBar(
      //     addRes.message || "Thêm tài xế thất bại!",
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
    } catch (error) {
      console.error("Lỗi khi thêm tài xế:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm tài xế",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  const handleOkUpdate = async () => {
    if (!selectedDriver.name || selectedDriver.name.trim() === "") {
      handleOpenSnackBar("Tên không được để trống!", "error");
      return;
    }

    if (!selectedDriver.birthDate) {
      handleOpenSnackBar("Ngày sinh không được để trống!", "error");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!selectedDriver.phone || !phoneRegex.test(selectedDriver.phone)) {
      handleOpenSnackBar(
        "Số điện thoại phải có 10–11 chữ số và không chứa ký tự đặc biệt!",
        "error"
      );
      return;
    }

    try {
      const userId = selectedDriver?.id;

      const genderNumber =
        selectedDriver.gender === "Nam"
          ? 1
          : selectedDriver.gender === "Nữ"
          ? 2
          : selectedDriver.gender === "Khác"
          ? 3
          : null;

      const formattedBirthDate = selectedDriver.dob
        ? selectedDriver.dob.includes("T")
          ? selectedDriver.dob
          : `${selectedDriver.dob}T00:00:00`
        : null;

      const payload = {
        name: selectedDriver.name,
        gender: genderNumber,
        birthDate: formattedBirthDate,
        phone: selectedDriver.phone,
      };

      const updateRes = await updateUserById(userId, payload);

      if (updateRes.code === 1000) {
        const usersRes = await getAllDrivers();
        if (usersRes.code === 1000) {
          const filteredUsers = usersRes.result?.filter(
            (user) => user.account?.role?.id === 2 && user.account?.status === 1
          );
          setUserList(filteredUsers);
          setFilteredData(usersRes.result);
          handleOpenSnackBar("Cập nhật tài xế thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tài xế!", "error");
        }
      } else {
        handleOpenSnackBar("Cập nhật tài xế thất bại!", "error");
      }

      setModals({ ...modals, update: false });
      setSelectedDriver(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật tài xế:", error);
      handleOpenSnackBar("Lỗi khi cập nhật tài xế!", "error");
      setModals({ ...modals, update: false });
      setSelectedDriver(null);
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
            <label htmlFor="dobAdd" className="form-label">
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="dobAdd"
              type="date"
              value={dataAdd.dobAdd}
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
              value={selectedDriver?.name || ""}
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
              value={selectedDriver?.gender || undefined}
              onChange={(value) =>
                setSelectedDriver({
                  ...selectedDriver,
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
              value={selectedDriver?.dob || ""}
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
              value={selectedDriver?.phone || ""}
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
              value={selectedDriver?.email || ""}
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
        return <RouteManage />;
      case 4:
        return <TripManage />;
      case 5:
        return <BusStationManage />;
      case 6:
        return <BusManage />;
      case 7:
        return <LocationManage />;
      case 8:
        return <UserInformation />;
      case 0:
      default:
        return (
          <Box sx={{ padding: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  QUẢN LÝ TÀI XẾ
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
                    title="Lọc Tài Xế"
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
              title="Thêm Tài Xế"
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
              Xác nhận xóa tài xế?
            </Modal>

            <Modal
              title="Cập Nhật Tài Xế"
              open={modals.update}
              onOk={handleOkUpdate}
              onCancel={() => toggleModal("update", false)}
              width={800}
            >
              {selectedDriver ? UpdateModal : <p>Đang tải...</p>}
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
    <div>
        {renderContent()}
    </div>
  );
};

export default UserManagement;
