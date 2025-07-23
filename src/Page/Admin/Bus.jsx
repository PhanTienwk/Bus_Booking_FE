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
import "./Bus.css";
import {
  handleGetAllBusApi,
  handleGetAllBusTypeApi,
  handleAddBus,
  handleUpdateBus,
  handleUpdateBusStatus,
  handleFilterBuses,
} from "../../services/BusService";
import FilterButtonBus from "../../components/Button/FilterButtonBus";

export default function BusManage() {
  const [, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [busTypes, setBusTypes] = useState([]);
  const [filterParams, setFilterParams] = useState(null);
  const [dataAdd, setDataAdd] = useState({
    busTypeIdAdd: "",
    nameAdd: "",
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
        const busesRes = await handleGetAllBusApi();
        const busTypesRes = await handleGetAllBusTypeApi();
        setBusTypes(busTypesRes.result);
        if (busesRes.code === 1000) {
          setData(busesRes.result);
          setFilteredData(busesRes.result);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách xe!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error.response?.data || error);
        handleOpenSnackBar(
          error.response?.data?.message || "Lỗi khi tải dữ liệu!",
          "error"
        );
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
        title: "Tên xe",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Loại xe",
        dataIndex: ["busType", "name"],
        key: "busTypeName",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Số ghế",
        dataIndex: ["busType", "seatCount"],
        key: "seatCount",
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

  const handleToggleStatus = async (id, checked) => {
    try {
      const status = checked ? 1 : 0;
      const response = await handleUpdateBusStatus(id, status);
      if (response.code === 1000) {
        if (filterParams) {
          const filterResponse = await handleFilterBuses(filterParams);
          console.log("param", filterParams);
          if (filterResponse.code === 1000) {
            setFilteredData(filterResponse.result);
            setData(filteredData); // Cập nhật cả data để đồng bộ
            handleOpenSnackBar("Cập nhật trạng thái xe thành công!", "success");
          } else {
            handleOpenSnackBar("Lỗi khi tải danh sách xe đã lọc!", "error");
          }
        } else {
          // Nếu không có bộ lọc, gọi handleGetAllBusApi
          const busesRes = await handleGetAllBusApi();
          if (busesRes.code === 1000) {
            setData(busesRes.result);
            setFilteredData(busesRes.result);
            handleOpenSnackBar("Cập nhật trạng thái xe thành công!", "success");
          } else {
            handleOpenSnackBar("Lỗi khi tải danh sách xe!", "error");
          }
        }
      } else {
        handleOpenSnackBar(
          response.data?.message || "Cập nhật trạng thái thất bại!",
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
    setSelectedBus({ ...record, busTypeId: record.busType?.id || "" });
  };

  // Xử lý mở modal xóa (chưa triển khai)
  // const handleDelete = (id) => {
  //   setModals({ ...modals, delete: true });
  //   setIdDelete(id);
  // };

  // Xử lý đóng/mở modal
  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  // Xử lý thay đổi input trong modal cập nhật
  const handleOnChangeInput = (id, event) => {
    const value = event.target.value;
    setSelectedBus({ ...selectedBus, [id]: value });
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
      const response = await handleFilterBuses(filterData);
      if (response.code === 1000) {
        setFilterParams(filterData);
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc xe thành công!", "success");
      } else {
        handleOpenSnackBar(response.message || "Lọc xe thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi lọc xe!",
        "error"
      );
    }
    setOpenFormFilter(false);
  };

  // Xử lý thêm xe
  const handleOkAdd = async () => {
    try {
      if (!dataAdd.busTypeIdAdd || !dataAdd.nameAdd) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }
      const payload = {
        busTypeIdAdd: parseInt(dataAdd.busTypeIdAdd),
        nameAdd: dataAdd.nameAdd,
        statusAdd: dataAdd.statusAdd ? 1 : 0,
      };
      const addRes = await handleAddBus(payload);
      if (addRes.code === 1000) {
        const busesRes = await handleGetAllBusApi();
        if (busesRes.code === 1000) {
          setData(busesRes.result);
          setFilteredData(busesRes.result);
          handleOpenSnackBar("Thêm xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách xe!", "error");
        }
      } else {
        handleOpenSnackBar(addRes.message || "Thêm xe thất bại!", "error");
      }
      setModals({ ...modals, add: false });
      setDataAdd({
        busTypeIdAdd: "",
        nameAdd: "",
        statusAdd: true,
      });
    } catch (error) {
      console.error("Lỗi khi thêm xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm xe!",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  // Xử lý cập nhật xe
  const handleOkUpdate = async () => {
    try {
      if (!selectedBus.busTypeId || !selectedBus.name) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }
      const payload = {
        busTypeIdAdd: selectedBus.busTypeId || selectedBus.busType?.id,
        nameAdd: selectedBus.name,
        statusAdd: selectedBus.status === 1 ? 1 : 0,
      };
      console.log("select bus ", payload);

      const updateRes = await handleUpdateBus(selectedBus.id, payload);
      if (updateRes.code === 1000) {
        const busesRes = await handleGetAllBusApi();
        if (busesRes.code === 1000) {
          setData(busesRes.result);
          setFilteredData(busesRes.result);
          handleOpenSnackBar("Cập nhật xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách xe!", "error");
        }
      } else {
        handleOpenSnackBar(
          updateRes.data.message || "Cập nhật xe thất bại!",
          "error"
        );
      }
      setModals({ ...modals, update: false });
      setSelectedBus(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi cập nhật xe!",
        "error"
      );
      setModals({ ...modals, update: false });
      setSelectedBus(null);
    }
  };

  // Modal thêm xe
  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label htmlFor="busTypeIdAdd" className="form-label">
              Loại xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busTypeIdAdd"
              className="w-100"
              placeholder="Chọn loại xe"
              value={dataAdd.busTypeIdAdd || undefined}
              onChange={(value) => handleSelectChange("busTypeIdAdd", value)}
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {busTypes.length > 0 ? (
                busTypes.map((busType) => (
                  <Select.Option
                    key={busType.id}
                    value={busType.id}
                    label={busType.name}
                  >
                    {busType.name} ({busType.seatCount} ghế)
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có loại xe
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
              Tên xe <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="nameAdd"
              placeholder="Nhập tên xe"
              value={dataAdd.nameAdd}
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

  // Modal cập nhật xe
  const UpdateModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <Input disabled id="id" value={selectedBus?.id || ""} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="busTypeId" className="form-label">
              Loại xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busTypeId"
              className="w-100"
              placeholder="Chọn loại xe"
              value={selectedBus?.busTypeId || undefined}
              onChange={(value) =>
                setSelectedBus({
                  ...selectedBus,
                  busTypeId: value,
                })
              }
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {busTypes.length > 0 ? (
                busTypes.map((busType) => (
                  <Select.Option
                    key={busType.id}
                    value={busType.id}
                    label={busType.name}
                  >
                    {busType.name} ({busType.seatCount} ghế)
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có loại xe
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
              Tên xe <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="name"
              placeholder="Nhập tên xe"
              value={selectedBus?.name || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={selectedBus?.status === 1}
              onChange={(checked) =>
                setSelectedBus({
                  ...selectedBus,
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
            QUẢN LÝ XE
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
                  <FilterButtonBus
                    onClose={() => setOpenFormFilter(false)}
                    onSubmit={onSubmitPopover}
                    busTypes={busTypes}
                  />
                </div>
              }
              title="Lọc Xe"
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
              pagination={{ pageSize: 10 }}
            />
          )}
        </CardContent>
      </Card>

      <Modal
        title="Thêm Xe"
        open={modals.add}
        onOk={handleOkAdd}
        onCancel={() => toggleModal("add", false)}
        width={800}
      >
        {AddModal}
      </Modal>

      <Modal
        title="Cập Nhật Xe"
        open={modals.update}
        onOk={handleOkUpdate}
        onCancel={() => toggleModal("update", false)}
        width={800}
      >
        {selectedBus ? UpdateModal : <p>Đang tải...</p>}
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
