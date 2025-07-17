import React, { useState } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const FilterButtonBusStation = ({ onClose, onSubmit, provinces }) => {
  const [filterData, setFilterData] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    provinceId: undefined,
    status: undefined,
  });

  const handleSubmit = () => {
    const formattedData = {
      id: filterData.id ? parseInt(filterData.id) : undefined,
      name: filterData.name || undefined,
      address: filterData.address || undefined,
      phone: filterData.phone || undefined,
      provinceId: filterData.provinceId || undefined,
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
        <label htmlFor="id">ID Bến Xe</label>
        <Input
          id="id"
          style={{ width: "100%" }}
          value={filterData.id}
          onChange={(e) => setFilterData({ ...filterData, id: e.target.value })}
          placeholder="Nhập ID bến xe"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name">Tên Bến Xe</label>
        <Input
          id="name"
          value={filterData.name}
          onChange={(e) =>
            setFilterData({ ...filterData, name: e.target.value })
          }
          placeholder="Nhập tên bến xe"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="address">Địa chỉ</label>
        <Input
          id="address"
          value={filterData.address}
          onChange={(e) =>
            setFilterData({ ...filterData, address: e.target.value })
          }
          placeholder="Nhập địa chỉ"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone">Số điện thoại</label>
        <Input
          id="phone"
          value={filterData.phone}
          onChange={(e) =>
            setFilterData({ ...filterData, phone: e.target.value })
          }
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="provinceId">Tỉnh/Thành phố</label>
        <Select
          id="provinceId"
          style={{ width: "100%" }}
          value={filterData.provinceId}
          onChange={(value) =>
            setFilterData({ ...filterData, provinceId: value })
          }
          placeholder="Chọn tỉnh/thành phố"
          showSearch
          filterOption={(input, option) =>
            (option.children || "").toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value={undefined}>Tất cả</Option>
          {provinces.map((province) => (
            <Option key={province.id} value={province.id}>
              {province.name}
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

export default FilterButtonBusStation;
