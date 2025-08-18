import {
  Box,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Table, Modal, Popover, Switch, Empty, Input, Button } from "antd";
import { PlusSquareOutlined, FilterOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import {
  handleAddProvince,
  handleUpdateProvince,
  handleUpdateProvinceStatus,
  handleFilterProvince,
} from "../../services/ProvinceService";
import { handleGetAllProvince } from "../../services/BusStationService";
import FilterButtonProvince from "../../components/Button/FilterButtonProvince";

export default function ProvinceManage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [openFormFilter, setOpenFormFilter] = useState(false);
  const [filterParams, setFilterParams] = useState(null);
  const [dataAdd, setDataAdd] = useState({
    nameAdd: "",
    statusAdd: true,
  });

  const [modals, setModals] = useState({
    update: false,
    add: false,
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provincesRes = await handleGetAllProvince();
        if (provincesRes.code === 1000) {
          setData(provincesRes.result);
          setFilteredData(provincesRes.result);
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tỉnh!", "error");
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
        title: "Tên tỉnh",
        dataIndex: "name",
        key: "name",
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
      const response = await handleUpdateProvinceStatus(id, status);
      if (response.code === 1000) {
        // Cập nhật trạng thái trực tiếp trong danh sách dữ liệu
        const updatedData = data.map((province) =>
          province.id === id ? { ...province, status } : province
        );
        setData(updatedData);
        if (filterParams) {
          const filterResponse = await handleFilterProvince(filterParams);
          if (filterResponse.code === 1000) {
            setFilteredData(filterResponse.result);
          } else {
            setFilteredData(updatedData); // Fallback nếu lọc thất bại
            handleOpenSnackBar("Lỗi khi tải danh sách tỉnh đã lọc!", "error");
          }
        } else {
          setFilteredData(updatedData);
        }
        handleOpenSnackBar(
          "Cập nhật trạng thái tỉnh/thành phố thành công!",
          "success"
        );
      } else {
        handleOpenSnackBar(
          response.message || "Cập nhật trạng thái tỉnh/thành phố thất bại!",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật trạng thái:",
        error.response?.data || error
      );
      handleOpenSnackBar(
        error.response?.data?.message ||
          "Lỗi khi cập nhật trạng thái tỉnh/thành phố!",
        "error"
      );
    }
  };

  // Xử lý mở modal cập nhật
  const handleUpdate = (record) => {
    setModals({ ...modals, update: true });
    setSelectedProvince({
      ...record,
    });
  };

  // Xử lý đóng/mở modal
  const toggleModal = (type, value) => {
    setModals({ ...modals, [type]: value });
  };

  // Xử lý thay đổi input trong modal cập nhật
  const handleOnChangeInput = (id, event) => {
    const value = event.target.value;
    setSelectedProvince({ ...selectedProvince, [id]: value });
  };

  // Xử lý thay đổi input trong modal thêm
  const handleOnChangeInputAdd = (id, event) => {
    const value = event.target.value;
    setDataAdd({ ...dataAdd, [id]: value });
  };

  // Xử lý thay đổi switch trong modal thêm
  const handleSwitchChange = (id, checked) => {
    setDataAdd({ ...dataAdd, [id]: checked });
  };

  // Xử lý lọc
  const onSubmitPopover = async (filterData) => {
    try {
      console.log("filterdata", filterData);
      const response = await handleFilterProvince(filterData);
      console.log("response", response, filterData);
      if (response.code === 1000) {
        setFilterParams(filterData);
        setFilteredData(response.result);
        handleOpenSnackBar("Lọc tỉnh thành công!", "success");
      } else {
        handleOpenSnackBar(response.message || "Lọc tỉnh thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi khi lọc tỉnh:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi lọc tỉnh!",
        "error"
      );
    }
    setOpenFormFilter(false);
  };

  // Xử lý thêm tỉnh
  const handleOkAdd = async () => {
    try {
      if (!dataAdd.nameAdd) {
        handleOpenSnackBar("Vui lòng điền tên tỉnh!", "error");
        return;
      }
      const payload = {
        nameAdd: dataAdd.nameAdd,
        statusAdd: dataAdd.statusAdd,
      };
      const addRes = await handleAddProvince(payload);
      if (addRes.code === 1000) {
        const provincesRes = await handleGetAllProvince();
        if (provincesRes.code === 1000) {
          setData(provincesRes.result);
          setFilteredData(provincesRes.result);
          handleOpenSnackBar("Thêm tỉnh thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tỉnh!", "error");
        }
      } else {
        handleOpenSnackBar(addRes.message || "Thêm tỉnh thất bại!", "error");
      }
      setModals({ ...modals, add: false });
      setDataAdd({
        nameAdd: "",
        statusAdd: true,
      });
    } catch (error) {
      console.error("Lỗi khi thêm tỉnh:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi thêm tỉnh!",
        "error"
      );
      setModals({ ...modals, add: false });
    }
  };

  // Xử lý cập nhật tỉnh
  const handleOkUpdate = async () => {
    try {
      if (!selectedProvince.name) {
        handleOpenSnackBar("Vui lòng điền tên tỉnh!", "error");
        return;
      }
      const payload = {
        name: selectedProvince.name,
        status: selectedProvince.status,
      };
      const updateRes = await handleUpdateProvince(
        selectedProvince.id,
        payload
      );
      if (updateRes.code === 1000) {
        const provincesRes = await handleGetAllProvince();
        if (provincesRes.code === 1000) {
          setData(provincesRes.result);
          setFilteredData(provincesRes.result);
          handleOpenSnackBar("Cập nhật tỉnh thành công!", "success");
        } else {
          handleOpenSnackBar("Lỗi khi tải danh sách tỉnh!", "error");
        }
      } else {
        handleOpenSnackBar(
          updateRes.message || "Cập nhật tỉnh thất bại!",
          "error"
        );
      }
      setModals({ ...modals, update: false });
      setSelectedProvince(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật tỉnh:", error.response?.data || error);
      handleOpenSnackBar(
        error.response?.data?.message || "Lỗi khi cập nhật tỉnh!",
        "error"
      );
      setModals({ ...modals, update: false });
      setSelectedProvince(null);
    }
  };

  // Modal thêm tỉnh
  const AddModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="nameAdd" className="form-label">
              Tên tỉnh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="nameAdd"
              placeholder="Nhập tên tỉnh"
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

  // Modal cập nhật tỉnh
  const UpdateModal = (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <Input disabled id="id" value={selectedProvince?.id || ""} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Tên tỉnh <span style={{ color: "red" }}>*</span>
            </label>
            <Input
              id="name"
              placeholder="Nhập tên tỉnh"
              value={selectedProvince?.name || ""}
              onChange={(event) => handleOnChangeInput(event.target.id, event)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trạng thái</label>
            <Switch
              checked={selectedProvince?.status === 1}
              onChange={(checked) =>
                setSelectedProvince({
                  ...selectedProvince,
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
            QUẢN LÝ TỈNH
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
                  <FilterButtonProvince
                    onClose={() => setOpenFormFilter(false)}
                    onSubmit={onSubmitPopover}
                  />
                </div>
              }
              title="Lọc Tỉnh"
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
            <Empty description="Không có dữ liệu" />
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
        title="Thêm Tỉnh"
        open={modals.add}
        onOk={handleOkAdd}
        onCancel={() => toggleModal("add", false)}
        width={800}
      >
        {AddModal}
      </Modal>

      <Modal
        title="Cập Nhật Tỉnh"
        open={modals.update}
        onOk={handleOkUpdate}
        onCancel={() => toggleModal("update", false)}
        width={800}
      >
        {selectedProvince ? UpdateModal : <p>Đang tải...</p>}
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
