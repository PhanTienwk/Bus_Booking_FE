import React, { useState } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const FilterButtonLocation = ({ onClose, onSubmit }) => {
  const [filterData, setFilterData] = useState({
    id: "",
    name: "",
    status: undefined,
  });

  const handleSubmit = () => {
    const formattedData = {
      id: filterData.id ? parseInt(filterData.id) : undefined,
      name: filterData.name || undefined,
      status:
        filterData.status !== undefined
          ? filterData.status
            ? 1
            : 0
          : undefined,
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="id">ID Tỉnh</label>
        <Input
          id="id"
          style={{ width: "100%" }}
          value={filterData.id}
          onChange={(e) => setFilterData({ ...filterData, id: e.target.value })}
          placeholder="Nhập ID tỉnh"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name">Tên Tỉnh</label>
        <Input
          id="name"
          value={filterData.name}
          onChange={(e) =>
            setFilterData({ ...filterData, name: e.target.value })
          }
          placeholder="Nhập tên tỉnh"
        />
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

export default FilterButtonLocation;