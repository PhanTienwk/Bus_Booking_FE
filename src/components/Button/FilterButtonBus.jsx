import React, { useState, useEffect } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const FilterButtonBus = ({ onClose, onSubmit, busTypes }) => {
  const [filterData, setFilterData] = useState({
    id: "",
    name: "",
    busTypeId: undefined,
    status: undefined,
  });

  // Nếu busTypes không được truyền từ props, bạn có thể gọi API để lấy danh sách loại xe
  // useEffect(() => {
  //   const fetchBusTypes = async () => {
  //     try {
  //       const response = await handleGetAllBusTypeApi();
  //       setBusTypes(response.data.result); // Giả sử API trả về { result: [...] }
  //     } catch (error) {
  //       console.error("Lỗi khi lấy danh sách loại xe:", error);
  //     }
  //   };
  //   fetchBusTypes();
  // }, []);

  const handleSubmit = () => {
    const formattedData = {
      id: filterData.id ? parseInt(filterData.id) : undefined,
      name: filterData.name || undefined,
      busTypeId: filterData.busTypeId || undefined,
      status:
        filterData.status !== undefined
          ? filterData.status
            ? 1
            : 0
          : undefined,
    };
    onSubmit(formattedData); // Gửi dữ liệu đã chuẩn hóa tới hàm onSubmit
    onClose(); // Đóng form sau khi submit
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="id">ID Xe</label>
        <Input
          id="id"
          style={{ width: "100%" }}
          value={filterData.id}
          onChange={(e) => setFilterData({ ...filterData, id: e.target.value })}
          placeholder="Nhập ID xe"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name">Tên Xe</label>
        <Input
          id="name"
          value={filterData.name}
          onChange={(e) =>
            setFilterData({ ...filterData, name: e.target.value })
          }
          placeholder="Nhập tên xe"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="busTypeId">Loại Xe</label>
        <Select
          id="busTypeId"
          style={{ width: "100%" }}
          value={filterData.busTypeId}
          onChange={(value) =>
            setFilterData({ ...filterData, busTypeId: value })
          }
          placeholder="Chọn loại xe"
          showSearch
          filterOption={(input, option) =>
            (option.children || "").toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value={undefined}>Tất cả</Option>
          {busTypes.map((busType) => (
            <Option key={busType.id} value={busType.id}>
              {busType.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="mb-3">
        <label htmlFor="status">Trạng thái</label>
        <Select
          id="status"
          style={{ width: "100%" }}
          value={filterData.status}
          onChange={(value) => setFilterData({ ...filterData, status: value })}
          placeholder="Chọn trạng thái"
        >
          <Option value={undefined}>Tất cả</Option>
          <Option value={true}>Hoạt động</Option>
          <Option value={false}>Không hoạt động</Option>
        </Select>
      </div>
      <Button type="primary" onClick={handleSubmit}>
        Lọc
      </Button>
      <Button onClick={onClose} style={{ marginLeft: 8 }}>
        Đóng
      </Button>
    </div>
  );
};

export default FilterButtonBus;
