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
  Switch,
  Button,
  Input,
  Empty,
  Popover,
  Select,
} from "antd";
import { PlusSquareOutlined, FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  getAllBusRoutes,
  addBusRoute,
  updateBusRouteById,
  disableBusRouteById,
  enableBusRouteById,
  handleFilterBusRoutes,
} from "../../services/RouteService";

import { handleGetAllBusStation } from "../../services/BusStationService";
import FilterButtonBusRoute from "../../components/Button/FilterButtonBusRoute";

const BusRoutePage = () => {
  const [, setRouteList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [busStations, setBusStations] = useState([]);
  const [allBusStations, setAllBusStations] = useState([]);
  const [dataAdd, setDataAdd] = useState({
    busStationFromId: null,
    busStationToId: null,
    distance: "",
    travelTime: "",
  });

  const [filterData, setFilterData] = useState({
    from: "",
    to: "",
  });
  const [modals, setModals] = useState({
    update: false,
    add: false,
    filter: false,
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routeRes, stationRes] = await Promise.all([
          getAllBusRoutes(),
          handleGetAllBusStation(),
        ]);

        if (routeRes.code === 1000) {
          const activeRoutes = routeRes.result?.filter(
            (route) => route.status === 1
          );
          setRouteList(activeRoutes);
          setFilteredData(activeRoutes);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tuyến xe!", "error");
        }

        if (stationRes.code === 1000) {
          setAllBusStations(stationRes.result); 
          const activeStations = stationRes.result.filter(
            (bs) => bs.status === 1
          );
          setBusStations(activeStations);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
        }
      } catch (error) {
        console.error(error);
        handleOpenSnackBar("Không thể kết nối máy chủ!", "error");
      }
    };

    fetchData();
  }, []);

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  const handleUpdate = async (record) => {
    setSelectedRoute({ ...record });
    await fetchBusStations();
    toggleModal("update", true);
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      let response;
      if (checked) {
        response = await enableBusRouteById(id);
      } else {
        response = await disableBusRouteById(id);
      }

      if (response.code === 1000) {
        const res = await getAllBusRoutes();
        if (res.code === 1000) {
          const activeRoutes = res.result?.filter(
            (route) => route.status === 1
          );
          setRouteList(activeRoutes);
          setFilteredData(activeRoutes);
          handleOpenSnackBar(
            checked
              ? "Khôi phục tuyến xe thành công!"
              : "Vô hiệu hóa tuyến xe thành công!",
            "success"
          );
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tuyến xe!", "error");
        }
      } else {
        handleOpenSnackBar(
          response.message || "Cập nhật trạng thái tuyến xe thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái!",
        "error"
      );
    }
  };

  const handleOnChangeInput = (field, value) => {
    setSelectedRoute({ ...selectedRoute, [field]: value });
  };

  const handleOnChangeInputAdd = (field, value) => {
    setDataAdd({ ...dataAdd, [field]: value });
  };

  const fetchBusStations = async () => {
    try {
      const res = await handleGetAllBusStation();
      console.log("Bus station response:", res);
      if (res.code === 1000) {
        setAllBusStations(res.result);
        const activeStations = res.result?.filter((bs) => bs.status === 1);
        setBusStations(activeStations);
      } else {
        handleOpenSnackBar("Lỗi khi tải danh sách bến xe!", "error");
      }
    } catch (error) {
      console.error(error);
      handleOpenSnackBar("Không thể kết nối máy chủ!", "error");
    }
  };

  const handleOkUpdate = async () => {
    if (!selectedRoute) return;

    try {
      const payload = {
        distance: selectedRoute.distance,
        travelTime: selectedRoute.travelTime,
        busStationFromId: selectedRoute.busStationFrom?.id,
        busStationToId: selectedRoute.busStationTo?.id,
      };

      const res = await updateBusRouteById(selectedRoute.id, payload);
      if (res.code === 1000) {
        handleOpenSnackBar("Cập nhật tuyến xe thành công!", "success");

        const reload = await getAllBusRoutes();
        if (reload.code === 1000) {
          const activeRoutes = reload.result?.filter(
            (route) => route.status === 1
          );
          setFilteredData(activeRoutes);
        }
      } else {
        handleOpenSnackBar(res.message || "Cập nhật thất bại!", "error");
      }
      toggleModal("update", false);
      setSelectedRoute(null);
    } catch (error) {
      console.error(error);
      handleOpenSnackBar("Lỗi khi cập nhật!", "error");
      toggleModal("update", false);
      setSelectedRoute(null);
    }
  };

  const onSubmitPopover = async (filterData) => {
    try {
      const response = await handleFilterBusRoutes(filterData);
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
    if (
      !dataAdd.busStationFromId ||
      !dataAdd.busStationToId ||
      !dataAdd.distance ||
      !dataAdd.travelTime
    ) {
      handleOpenSnackBar("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }
    try {
      const payload = {
        busStationFromId: dataAdd.busStationFromId,
        busStationToId: dataAdd.busStationToId,
        distance: parseFloat(dataAdd.distance),
        travelTime: parseFloat(dataAdd.travelTime),
      };

      const res = await addBusRoute(payload);
      if (res.code === 1000) {
        handleOpenSnackBar("Thêm tuyến xe thành công!", "success");
        const reload = await getAllBusRoutes();
        if (reload.code === 1000) {
          const activeRoutes = reload.result?.filter(
            (route) => route.status === 1
          );
          setFilteredData(activeRoutes);
        }
        toggleModal("add", false);
        setDataAdd({
          busStationFromId: null,
          busStationToId: null,
          distance: "",
          travelTime: "",
        });
      } else {
        handleOpenSnackBar(res.message || "Thêm thất bại!", "error");
      }
    } catch (error) {
      console.error(error);
      handleOpenSnackBar("Lỗi khi thêm tuyến xe!", "error");
    }
  };

  const handleOkFilter = async () => {
    try {
      const res = await handleFilterBusRoutes(filterData);
      if (res.code === 1000) {
        setFilteredData(res.result);
        handleOpenSnackBar("Lọc tuyến xe thành công!", "success");
        toggleModal("filter", false);
      } else {
        handleOpenSnackBar(res.message || "Lọc thất bại!", "error");
      }
    } catch (error) {
      console.error(error);
      handleOpenSnackBar("Lỗi khi lọc!", "error");
    }
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
      render: (status, record) => (
        <Switch
          checked={status === 1}
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

  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đi</label>
          <Select
            style={{ width: "100%" }}
            value={dataAdd.busStationFromId}
            onChange={(value) =>
              setDataAdd({ ...dataAdd, busStationFromId: value })
            }
          >
            {busStations.map((bs) => (
              <Select.Option key={bs.id} value={bs.id}>
                {bs.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đến</label>
          <Select
            style={{ width: "100%" }}
            value={dataAdd.busStationToId}
            onChange={(value) =>
              setDataAdd({ ...dataAdd, busStationToId: value })
            }
          >
            {busStations.map((bs) => (
              <Select.Option key={bs.id} value={bs.id}>
                {bs.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Khoảng cách (km)</label>
          <Input
            type="number"
            value={dataAdd.distance}
            onChange={(e) => handleOnChangeInputAdd("distance", e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Thời gian (giờ)</label>
          <Input
            type="number"
            value={dataAdd.travelTime}
            onChange={(e) =>
              handleOnChangeInputAdd("travelTime", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const UpdateModal = selectedRoute && (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đi</label>
          <Select
            style={{ width: "100%" }}
            value={selectedRoute?.busStationFrom?.id}
            onChange={(value) => {
              const selectedStation = busStations.find((bs) => bs.id === value);
              setSelectedRoute({
                ...selectedRoute,
                busStationFrom: selectedStation,
              });
            }}
          >
            {busStations.map((bs) => (
              <Select.Option key={bs.id} value={bs.id}>
                {bs.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đến</label>
          <Select
            style={{ width: "100%" }}
            value={selectedRoute?.busStationTo?.id}
            onChange={(value) => {
              const selectedStation = busStations.find((bs) => bs.id === value);
              setSelectedRoute({
                ...selectedRoute,
                busStationTo: selectedStation,
              });
            }}
          >
            {busStations.map((bs) => (
              <Select.Option key={bs.id} value={bs.id}>
                {bs.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Khoảng cách (km)</label>
          <Input
            type="number"
            value={selectedRoute.distance}
            onChange={(e) =>
              handleOnChangeInput("distance", parseFloat(e.target.value))
            }
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Thời gian (giờ)</label>
          <Input
            type="number"
            value={selectedRoute.travelTime}
            onChange={(e) =>
              handleOnChangeInput("travelTime", parseFloat(e.target.value))
            }
          />
        </div>
      </div>
    </div>
  );

  const FilterModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đi</label>
          <Input
            value={filterData.from}
            onChange={(e) =>
              setFilterData({ ...filterData, from: e.target.value })
            }
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Bến đến</label>
          <Input
            value={filterData.to}
            onChange={(e) =>
              setFilterData({ ...filterData, to: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            DANH SÁCH TUYẾN XE
          </Typography>

          <div className="button-group">
            <Button
              className="button-add"
              size="large"
              onClick={async () => {
                await fetchBusStations();
                toggleModal("add", true);
              }}
            >
              <PlusSquareOutlined /> Tạo mới
            </Button>
            <Popover
              placement="bottomRight"
              content={
                <div style={{ width: 400 }}>
                  <FilterButtonBusRoute
                    busStations={allBusStations}
                    onClose={() => setOpenFormFilter(false)}
                    onSubmit={onSubmitPopover}
                  />
                </div>
              }
              title="Lọc Tài Xế"
              trigger="click"
              open={openFormFilter}
              onOpenChange={setOpenFormFilter}
            >
              <Button className="filter-button">
                Lọc <FilterOutlined />
              </Button>
            </Popover>
          </div>

          {filteredData.length === 0 ? (
            <Empty description="Không có tuyến xe" />
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
        title="Thêm Tuyến Xe"
        open={modals.add}
        onOk={handleOkAdd}
        onCancel={() => toggleModal("add", false)}
        width={600}
      >
        {AddModal}
      </Modal>

      <Modal
        title="Cập nhật Tuyến Xe"
        open={modals.update}
        onOk={handleOkUpdate}
        onCancel={() => toggleModal("update", false)}
        width={600}
      >
        {UpdateModal}
      </Modal>

      <Modal
        title="Lọc Tuyến Xe"
        open={modals.filter}
        onOk={handleOkFilter}
        onCancel={() => toggleModal("filter", false)}
        width={500}
      >
        {FilterModal}
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
};

export default BusRoutePage;
