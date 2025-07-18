import React, { useState } from "react";
import { Button, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

const FilterButtonUser = ({ onClose, onSubmit }) => {
  const [filterData, setFilterData] = useState({
    name: "",
    gender: undefined,
    birthday: null,
    phone: "",
    email: "",
    status: undefined,
  });

  const handleSubmit = () => {
    const formattedData = {
      name: filterData.name || undefined,
      gender: filterData.gender === "all" ? undefined : filterData.gender,
      birthday: filterData.birthday
        ? dayjs(filterData.birthday).format("YYYY-MM-DD") + "T00:00:00"
        : undefined,
      phone: filterData.phone || undefined,
      email: filterData.email || undefined,
      status:
        filterData.status === "all"
          ? undefined
          : filterData.status === "active"
          ? 1
          : filterData.status === "inactive"
          ? 0
          : undefined,
      roleId: 1,
    };

    onSubmit(formattedData);
    onClose();
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="name">Họ tên</label>
        <Input
          id="name"
          value={filterData.name}
          onChange={(e) =>
            setFilterData({ ...filterData, name: e.target.value })
          }
          placeholder="Nhập họ tên"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="gender">Giới tính</label>
        <Select
          id="gender"
          style={{ width: "100%" }}
          value={filterData.gender}
          onChange={(value) => setFilterData({ ...filterData, gender: value })}
          placeholder="Chọn giới tính"
        >
          <Option value="all">Tất cả</Option>
          <Option value={1}>Nam</Option>
          <Option value={2}>Nữ</Option>
          <Option value={3}>Khác</Option>
        </Select>
      </div>

      <div className="mb-3">
        <label htmlFor="birthday">Ngày sinh</label>
        <DatePicker
          id="birthday"
          style={{ width: "100%" }}
          format="YYYY-MM-DD"
          value={filterData.birthday ? dayjs(filterData.birthday) : null}
          onChange={(date) => setFilterData({ ...filterData, birthday: date })}
          placeholder="Chọn ngày sinh"
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
        <label htmlFor="email">Email</label>
        <Input
          id="email"
          value={filterData.email}
          onChange={(e) =>
            setFilterData({ ...filterData, email: e.target.value })
          }
          placeholder="Nhập email"
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
          <Option value="all">Tất cả</Option>
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Không hoạt động</Option>
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

export default FilterButtonUser;
