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
import { toast } from "react-toastify";
import "./BusStation.css";
import {
  handleGetAllBusStation,
  handleGetAllProvince,
  handleUpdateBusStation,
  handleAddBusStation,
  handleFilterBusStations,
  handleUpdateBusStationStatus,
} from "../../services/BusStationService";
import FilterButtonBusStation from "../../components/Button/FilterButtonBusStation";

export default function BusStationManage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBusStation, setSelectedBusStation] = useState(null);
  const [idDelete, setIdDelete] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [dataAdd, setDataAdd] = useState({
    provinceIdAdd: "",
    nameAdd: "",
    addressAdd: "",
    phoneAdd: "",
    statusAdd: true,
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
        const busStationsRes = await handleGetAllBusStation();
        const provinceRes = await handleGetAllProvince();
        setProvinces(provinceRes.result);
        if (busStationsRes.code === 1000) {
          setData(busStationsRes.result);
          setFilteredData(busStationsRes.result);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        handleOpenSnackBar("Lỗi khi tải dữ liệu!", "error");
      }
    };

    fetchData();
  }, []);

  // Xử lý Snackbar
  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  // Định nghĩa cột cho bảng
  const getColumns = () => {
    return [
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
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Trạng thái",
        key: "status",
        render: (_, record) => (
          <Switch
            checked={record.status === 1}
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

  // Xử lý chuyển đổi trạng thái
  const handleToggleStatus = async (id, checked) => {
    try {
      const status = checked ? 1 : 0;
      const response = await handleUpdateBusStationStatus(id, status);
      if (response.code === 1000) {
        const busStationsRes = await handleGetAllBusStation();
        if (busStationsRes.code === 1000) {
          setData(busStationsRes.result);
          setFilteredData(busStationsRes.result);
          handleOpenSnackBar(
            "Cập nhật trạng thái bến xe thành công!",
            "success"
          );
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
        }
      } else {
        handleOpenSnackBar(
          response.message || "Cập nhật trạng thái thất bại!",
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

  // Xử lý mở modal cập nhật
  const handleUpdate = (record) => {
    setModals({ ...modals, update: true });
    setSelectedBusStation({ ...record, provinceId: record.province?.id || "" });
  };

  // Xử lý mở modal xóa
  const handleDelete = (id) => {
    setModals({ ...modals, delete: true });
    setIdDelete(id);
  };

  // Xử lý đóng/mở modal
  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  // Xử lý thay đổi input trong modal cập nhật
  const handleOnChangeInput = (id, event) => {
    const value = event.target.value;
    setSelectedBusStation({ ...selectedBusStation, [id]: value });
  };

  // Xử lý thay đổi input trong modal thêm
  const handleOnChangeInputAdd = (id, event) => {
    const value = event.target.value;
    setDataAdd({ ...dataAdd, [id]: value });
  };

  // Xử lý thay đổi select trong modal thêm
  const handleSelectChange = (id, value) => {
    setDataAdd({ ...dataAdd, [id]: value });
  };

  // Xử lý thay đổi switch trong modal thêm
  const handleSwitchChange = (id, checked) => {
    setDataAdd({ ...dataAdd, [id]: checked });
  };

  // Xử lý lọc
  const onSubmitPopover = async (filterData) => {
    try {
      const response = await handleFilterBusStations(filterData);
      if (response.code === 1000) {
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc bến xe thành công!", "success");
      } else {
        handleOpenSnackBar(response.message || "Lọc bến xe thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc bến xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi lọc bến xe!",
        "error"
      );
    }
    setOpenFormFilter(false);
  };

  // Xử lý thêm bến xe
  const handleOkAdd = async () => {
    try {
      // Xác thực dữ liệu trước khi gửi
      if (
        !dataAdd.provinceIdAdd ||
        !dataAdd.nameAdd ||
        !dataAdd.addressAdd ||
        !dataAdd.phoneAdd
      ) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }

      const payload = {
        provinceIdAdd: parseInt(dataAdd.provinceIdAdd),
        nameAdd: dataAdd.nameAdd,
        addressAdd: dataAdd.addressAdd,
        phoneAdd: dataAdd.phoneAdd,
        statusAdd: dataAdd.statusAdd ? 1 : 0,
      };
      console.log("Payload for add:", payload);

      const addRes = await handleAddBusStation(payload);
      if (addRes.code === 1000) {
        const busStationsRes = await handleGetAllBusStation();
        if (busStationsRes.code === 1000) {
          setData(busStationsRes.result);
          setFilteredData(busStationsRes.result);
          handleOpenSnackBar("Thêm bến xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
        }
      } else {
        handleOpenSnackBar(addRes.message || "Thêm bến xe thất bại!", "error");
      }

      setModals({ ...modals, add: false });
      setDataAdd({
        provinceIdAdd: "",
        nameAdd: "",
        addressAdd: "",
        phoneAdd: "",
        statusAdd: true,
      });
    } catch (error) {
      console.error("Lỗi khi thêm bến xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm bến xe!",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  // Xử lý cập nhật bến xe
  const handleOkUpdate = async () => {
    try {
      const updateRes = await handleUpdateBusStation(selectedBusStation);
      if (updateRes.code === 1000) {
        const busStationsRes = await handleGetAllBusStation();
        if (busStationsRes.code === 1000) {
          setData(busStationsRes.result);
          setFilteredData(busStationsRes.result);
          handleOpenSnackBar("Cập nhật bến xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
        }
      } else {
        handleOpenSnackBar("Cập nhật bến xe thất bại!", "error");
      }

      setModals({ ...modals, update: false });
      setSelectedBusStation(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật bến xe:", error);
      handleOpenSnackBar("Lỗi khi cập nhật bến xe!", "error");
      setModals({ ...modals, update: false });
      setSelectedBusStation(null);
    }
  };

  // Xử lý xóa bến xe
  const handleOkDelete = () => {
    handleOpenSnackBar("Chức năng xóa chưa được triển khai!", "error");
    setModals({ ...modals, delete: false });
  };

  // Modal thêm bến xe
  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="provinceIdAdd" className="form-label">
              Tỉnh/Thành phố <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="provinceIdAdd"
              className="w-100"
              placeholder="Chọn tỉnh/thành phố"
              value={dataAdd.provinceIdAdd || undefined}
              onChange={(value) => handleSelectChange("provinceIdAdd", value)}
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {provinces.length > 0 ? (
                provinces.map((province) => (
                  <Select.Option
                    key={province.id}
                    value={province.id}
                    label={province.name}
                  >
                    {province.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tỉnh/thành phố
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="nameAdd" className="form-label">
              Tên bến xe <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="nameAdd"
              placeholder="Nhập tên bến xe"
              value={dataAdd.nameAdd}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="addressAdd" className="form-label">
              Địa chỉ <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="addressAdd"
              placeholder="Nhập địa chỉ"
              value={dataAdd.addressAdd}
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
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={dataAdd.statusAdd}
              onChange={(checked) => handleSwitchChange("statusAdd", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Modal cập nhật bến xe
  const UpdateModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <Input disabled id="id" value={selectedBusStation?.id || ""} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="provinceId" className="form-label">
              Tỉnh/Thành phố <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="provinceId"
              className="w-100"
              placeholder="Chọn tỉnh/thành phố"
              value={selectedBusStation?.provinceId || undefined}
              onChange={(value) =>
                setSelectedBusStation({
                  ...selectedBusStation,
                  provinceId: value,
                })
              }
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {provinces.length > 0 ? (
                provinces.map((province) => (
                  <Select.Option
                    key={province.id}
                    value={province.id}
                    label={province.name}
                  >
                    {province.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tỉnh/thành phố
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Tên bến xe <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="name"
              placeholder="Nhập tên bến xe"
              value={selectedBusStation?.name || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Địa chỉ <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="address"
              placeholder="Nhập địa chỉ"
              value={selectedBusStation?.address || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Số điện thoại <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              value={selectedBusStation?.phone || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={selectedBusStation?.status === 1}
              onChange={(checked) =>
                setSelectedBusStation({
                  ...selectedBusStation,
                  status: checked ? 1 : 0,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            QUẢN LÝ BẾN XE
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
                  <FilterButtonBusStation
                    onClose={() => setOpenFormFilter(false)}
                    onSubmit={onSubmitPopover}
                    provinces={provinces}
                  />
                </div>
              }
              title="Lọc Bến Xe"
              trigger="click"
              open={openFormFilter}
              onOpenChange={setOpenFormFilter}
              destroyTooltipOnHide={false}
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
        title="Thêm Bến Xe"
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
        Xác nhận xóa bến xe?
      </Modal>

      <Modal
        title="Cập Nhật Bến Xe"
        open={modals.update}
        onOk={handleOkUpdate}
        onCancel={() => toggleModal("update", false)}
        width={800}
      >
        {selectedBusStation ? UpdateModal : <p>Đang tải...</p>}
      </Modal>

      <Snackbar
        open={snackBar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
