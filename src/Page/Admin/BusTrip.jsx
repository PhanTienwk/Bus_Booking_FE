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
  DatePicker,
} from "antd";
import { PlusSquareOutlined, FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import moment from "moment";
// import moment from "moment-timezone";
import { handleGetAllBusApi } from "../../services/BusService";
import {
  handleGetAllBusRoute,
  handleGetAllBusTrip,
  handleGetAllUserApi,
  handleUpdateBusTripStatus,
  handleAddBusTrip,
  handleUpdateBusTrip,
  handleFilterBusTrips,
} from "../../services/BusTripService";
import FilterButtonBusTrip from "../../components/Button/FilterButtonTrip";

export default function BusTripManage() {
  const [, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [busRoutes, setBusRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedBusTrip, setSelectedBusTrip] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [dataAdd, setDataAdd] = useState({
    busRouteId: "",
    departureTime: null,
    costOperating: "",
    costIncurred: "",
    price: "",
    busId: "",
    driverId: "",
    status: true,
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
        const busTripsRes = await handleGetAllBusTrip();
        const busRoutesRes = await handleGetAllBusRoute();
        const busesRes = await handleGetAllBusApi(); // Assuming this API exists
        const driversRes = await handleGetAllUserApi();
        setBusRoutes(busRoutesRes.result || []);
        setBuses(busesRes.result || []);
        // console.log("cvcv", driversRes);
        setDrivers(
          driversRes.result.filter((driver) => driver.account.role.id === 1) ||
            []
        );
        //    setDrivers((driversRes.result || []).filter(driver => driver.id === 1));

        if (busTripsRes.code === 1000) {
          setData(busTripsRes.result);
          setFilteredData(busTripsRes.result);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách chuyến xe!", "error");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        handleOpenSnackBar("Lỗi khi tải dữ liệu!", "error");
      }
    };

    fetchData();
  }, []);

  // Handle Snackbar
  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  // Define table columns
  const getColumns = () => {
    return [
      { title: "ID", dataIndex: "id", key: "id" },
      {
        title: "Tuyến xe",
        dataIndex: ["busRoute", "id"],
        key: "busRoute",
        render: (_, record) =>
          record.busRoute
            ? `${record.busRoute.busStationFrom?.name} - ${record.busRoute.busStationTo?.name}`
            : "Chưa xác định",
      },
      {
        title: "Thời gian khởi hành",
        dataIndex: "departureTime",
        key: "departureTime",
        render: (text) =>
          text ? moment(text).format("DD/MM/YYYY HH:mm") : "Chưa xác định",
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
      { title: "Giá vé", dataIndex: "price", key: "price" },
      {
        title: "Xe",
        dataIndex: ["bus", "name"],
        key: "busName",
        render: (text) => text || "Chưa xác định",
      },
      {
        title: "Tài xế",
        dataIndex: ["user", "name"],
        key: "driverName",
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
          <Button type="primary" ghost onClick={() => handleUpdate(record)}>
            Cập nhật
          </Button>
        ),
      },
    ];
  };

  // Handle status toggle
  const handleToggleStatus = async (id, checked) => {
    try {
      const status = checked ? 1 : 0;
      const response = await handleUpdateBusTripStatus(id, status);

      if (response.code === 1000) {
        const busTripsRes = await handleGetAllBusTrip();
        if (busTripsRes.code === 1000) {
          setData(busTripsRes.result);
          setFilteredData(busTripsRes.result);
          handleOpenSnackBar(
            "Cập nhật trạng thái chuyến xe thành công!",
            "success"
          );
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách chuyến xe!", "error");
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

  // Handle update modal
  const handleUpdate = (record) => {
    setModals({ ...modals, update: true });
    setSelectedBusTrip({
      ...record,
      busRouteId: record.busRoute?.id || "",
      busId: record.bus?.id || "",
      driverId: record.user?.id || "",
      departureTime: record.departureTime ? moment(record.departureTime) : null,
    });
  };

  // Handle delete modal
  // const handleDelete = (id) => {
  //   setModals({ ...modals, delete: true });
  //   setIdDelete(id);
  // };

  // Toggle modal
  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  // Handle input change for update modal
  const handleOnChangeInput = (id, event) => {
    const value = event.target.value;
    setSelectedBusTrip({ ...selectedBusTrip, [id]: value });
  };

  // Handle input change for add modal
  const handleOnChangeInputAdd = (id, event) => {
    const value = event.target.value;
    setDataAdd({ ...dataAdd, [id]: value });
  };

  // Handle select change
  const handleSelectChange = (id, value) => {
    setDataAdd({ ...dataAdd, [id]: value });
  };

  // Handle date picker change
  const handleDateChange = (id, date) => {
    setDataAdd({ ...dataAdd, [id]: date });
  };

  // Handle switch change
  const handleSwitchChange = (id, checked) => {
    setDataAdd({ ...dataAdd, [id]: checked });
  };

  // Handle add bus trip
  const handleOkAdd = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (
        !dataAdd.busRouteId ||
        !dataAdd.departureTime ||
        !dataAdd.costOperating ||
        !dataAdd.costIncurred ||
        !dataAdd.price ||
        !dataAdd.busId ||
        !dataAdd.driverId
      ) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }

      // Tạo payload cho API
      const departureTime7h = new Date(dataAdd.departureTime);
      departureTime7h.setHours(departureTime7h.getHours() + 7);
      const result = departureTime7h.toISOString();
      const payload = {
        busRouteId: parseInt(dataAdd.busRouteId),
        departureTime: result,
        costOperating: parseFloat(dataAdd.costOperating),
        costIncurred: parseFloat(dataAdd.costIncurred),
        price: parseInt(dataAdd.price),
        busId: parseInt(dataAdd.busId),
        driverId: parseInt(dataAdd.driverId),
        status: dataAdd.status ? 1 : 0,
      };

      // Gọi API thêm chuyến xe
      const addRes = await handleAddBusTrip(payload);
      if (addRes && addRes.result) {
        // Lấy lại danh sách chuyến xe sau khi thêm thành công
        const busTripsRes = await handleGetAllBusTrip();
        if (busTripsRes && busTripsRes.code === 1000) {
          setData(busTripsRes.result);
          setFilteredData(busTripsRes.result);
          handleOpenSnackBar("Thêm chuyến xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách chuyến xe!", "error");
        }
      } else {
        handleOpenSnackBar(
          addRes.data?.message || "Thêm chuyến xe thất bại!",
          "error"
        );
      }

      // Đóng modal và reset form
      setModals({ ...modals, add: false });
      setDataAdd({
        busRouteId: "",
        departureTime: null,
        costOperating: "",
        costIncurred: "",
        price: "",
        busId: "",
        driverId: "",
        status: true,
      });
    } catch (error) {
      console.error("Lỗi khi thêm chuyến xe:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm chuyến xe!",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  // Handle update bus trip
  const handleOkUpdate = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      if (
        !selectedBusTrip.busRouteId ||
        !selectedBusTrip.departureTime ||
        !selectedBusTrip.costOperating ||
        !selectedBusTrip.costIncurred ||
        !selectedBusTrip.price ||
        !selectedBusTrip.busId ||
        !selectedBusTrip.driverId
      ) {
        handleOpenSnackBar(
          "Vui lòng điền đầy đủ các trường bắt buộc!",
          "error"
        );
        return;
      }

      const departureTime7h = new Date(selectedBusTrip.departureTime);
      departureTime7h.setHours(departureTime7h.getHours() + 7);
      const result = departureTime7h.toISOString();
      const payload = {
        busRouteId: parseInt(selectedBusTrip.busRouteId),
        departureTime: result,
        costOperating: parseFloat(selectedBusTrip.costOperating),
        costIncurred: parseFloat(selectedBusTrip.costIncurred),
        price: parseInt(selectedBusTrip.price),
        busId: parseInt(selectedBusTrip.busId),
        driverId: parseInt(selectedBusTrip.driverId),
        status: selectedBusTrip.status,
      };

      // Gọi API cập nhật chuyến xe
      const updateRes = await handleUpdateBusTrip(selectedBusTrip.id, payload);
      console.log("check data", updateRes);
      if (updateRes && updateRes.result) {
        // Lấy lại danh sách chuyến xe sau khi cập nhật thành công
        const busTripsRes = await handleGetAllBusTrip();
        if (busTripsRes && busTripsRes.code === 1000) {
          setData(busTripsRes.result);
          setFilteredData(busTripsRes.result);
          handleOpenSnackBar("Cập nhật chuyến xe thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách chuyến xe!", "error");
        }
      } else {
        handleOpenSnackBar(
          updateRes.data?.message || "Cập nhật chuyến xe thất bại!",
          "error"
        );
      }

      // Đóng modal và reset state
      setModals({ ...modals, update: false });
      setSelectedBusTrip(null);
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật chuyến xe:",
        error.response?.data || error
      );
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi cập nhật chuyến xe!",
        "error"
      );
      setModals({ ...modals, update: false });
      setSelectedBusTrip(null);
    }
  };

  // Handle delete bus trip
  const handleOkDelete = () => {
    handleOpenSnackBar("Chức năng xóa chưa được triển khai!", "error");
    setModals({ ...modals, delete: false });
  };

  const handleFilter = async (filterData) => {
    try {
      const response = await handleFilterBusTrips(filterData);
      if (response.code === 1000) {
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc chuyến xe thành công!", "success");
      } else {
        handleOpenSnackBar("Lỗi khi lọc chuyến xe!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc chuyến xe:", error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi lọc chuyến xe!",
        "error"
      );
    }
    setOpenFormFilter(false);
  };

  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="busRouteId" className="form-label">
              Tuyến xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busRouteId"
              className="w-100"
              placeholder="Chọn tuyến xe"
              value={dataAdd.busRouteId || undefined}
              onChange={(value) => handleSelectChange("busRouteId", value)}
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {busRoutes.length > 0 ? (
                busRoutes.map((route) => (
                  <Select.Option
                    key={route.id}
                    value={route.id}
                    label={`${route.busStationFrom?.name} - ${route.busStationTo?.name}`}
                  >
                    {`${route.busStationFrom?.name} - ${route.busStationTo?.name}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tuyến xe
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="departureTime" className="form-label">
              Thời gian khởi hành <span style={{ color: "red" }}>*</span>
            </label>
            <DatePicker
              id="departureTime"
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-100"
              value={dataAdd.departureTime}
              onChange={(date) => handleDateChange("departureTime", date)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="costOperating" className="form-label">
              Chi phí vận hành <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="costOperating"
              placeholder="Nhập chi phí vận hành"
              value={dataAdd.costOperating}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
              type="number"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="costIncurred" className="form-label">
              Chi phí phát sinh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="costIncurred"
              placeholder="Nhập chi phí phát sinh"
              value={dataAdd.costIncurred}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
              type="number"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Giá vé <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="price"
              placeholder="Nhập giá vé"
              value={dataAdd.price}
              onChange={(event) =>
                handleOnChangeInputAdd(event.target.id, event)
              }
              type="number"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="busId" className="form-label">
              Xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busId"
              className="w-100"
              placeholder="Chọn xe"
              value={dataAdd.busId || undefined}
              onChange={(value) => handleSelectChange("busId", value)}
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {buses.length > 0 ? (
                buses.map((bus) => (
                  <Select.Option key={bus.id} value={bus.id} label={bus.name}>
                    {bus.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có xe
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="driverId" className="form-label">
              Tài xế <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="driverId"
              className="w-100"
              placeholder="Chọn tài xế"
              value={dataAdd.driverId || undefined}
              onChange={(value) => handleSelectChange("driverId", value)}
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <Select.Option
                    key={driver.id}
                    value={driver.id}
                    label={driver.name}
                  >
                    {driver.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tài xế
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={dataAdd.status}
              onChange={(checked) => handleSwitchChange("status", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Update Modal
  const UpdateModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <Input disabled id="id" value={selectedBusTrip?.id || ""} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="busRouteId" className="form-label">
              Tuyến xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busRouteId"
              className="w-100"
              placeholder="Chọn tuyến xe"
              value={selectedBusTrip?.busRouteId || undefined}
              onChange={(value) =>
                setSelectedBusTrip({ ...selectedBusTrip, busRouteId: value })
              }
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {busRoutes.length > 0 ? (
                busRoutes.map((route) => (
                  <Select.Option
                    key={route.id}
                    value={route.id}
                    label={`${route.busStationFrom?.name} - ${route.busStationTo?.name}`}
                  >
                    {`${route.busStationFrom?.name} - ${route.busStationTo?.name}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tuyến xe
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="departureTime" className="form-label">
              Thời gian khởi hành <span style={{ color: "red" }}>*</span>
            </label>
            <DatePicker
              id="departureTime"
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-100"
              value={selectedBusTrip?.departureTime}
              onChange={(date) =>
                setSelectedBusTrip({ ...selectedBusTrip, departureTime: date })
              }
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="costOperating" className="form-label">
              Chi phí vận hành (VNĐ)<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="costOperating"
              placeholder="Nhập chi phí vận hành"
              value={selectedBusTrip?.costOperating || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
              type="number"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="costIncurred" className="form-label">
              Chi phí phát sinh (VNĐ)<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="costIncurred"
              placeholder="Nhập chi phí phát sinh"
              value={selectedBusTrip?.costIncurred || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
              type="number"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Giá vé (VNĐ)<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="price"
              placeholder="Nhập giá vé"
              value={selectedBusTrip?.price || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
              type="number"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="busId" className="form-label">
              Xe <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              id="busId"
              className="w-100"
              placeholder="Chọn xe"
              value={selectedBusTrip?.busId || undefined}
              onChange={(value) =>
                setSelectedBusTrip({ ...selectedBusTrip, busId: value })
              }
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {buses.length > 0 ? (
                buses.map((bus) => (
                  <Select.Option key={bus.id} value={bus.id} label={bus.name}>
                    {bus.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có xe
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="driverId" className="form-label">
              Tài xế <span style={{ color: "red" }}>*</span>
            </label>
            <Select
              style={{ width: "95px" }}
              id="driverId"
              className="w-100"
              placeholder="Chọn tài xế"
              value={selectedBusTrip?.driverId || undefined}
              onChange={(value) =>
                setSelectedBusTrip({ ...selectedBusTrip, driverId: value })
              }
              showSearch
              filterOption={(input, option) =>
                (option.label || "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <Select.Option
                    key={driver.id}
                    value={driver.id}
                    label={driver.name}
                  >
                    {driver.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  Không có tài xế
                </Select.Option>
              )}
            </Select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={selectedBusTrip?.status === 1}
              onChange={(checked) =>
                setSelectedBusTrip({
                  ...selectedBusTrip,
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
            QUẢN LÝ CHUYẾN XE
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
                <FilterButtonBusTrip
                  onClose={() => setOpenFormFilter(false)}
                  onSubmit={handleFilter}
                  busRoutes={busRoutes}
                  buses={buses}
                  drivers={drivers}
                />
              }
              title="Lọc Chuyến Xe"
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
        title="Thêm Chuyến Xe"
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
        Xác nhận xóa chuyến xe?
      </Modal>

      <Modal
        title="Cập Nhật Chuyến Xe"
        open={modals.update}
        onOk={handleOkUpdate}
        onCancel={() => toggleModal("update", false)}
        width={800}
      >
        {selectedBusTrip ? UpdateModal : <p>Đang tải...</p>}
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
