import React, { useState } from "react";
import { Button, Input, Select } from "antd";

const { Option } = Select;

const FilterButtonTicketCancel = ({ onClose, onSubmit }) => {
  const [filterData, setFilterData] = useState({
    name: "",
    phone: "",
    email: "",
    status: undefined,
    seatName: "",
    bankAccountNumber: "",
  });

  const handleSubmit = () => {
    const formattedData = {
      name: filterData.name || undefined,
      phone: filterData.phone || undefined,
      email: filterData.email || undefined,
      status: filterData.status !== undefined ? filterData.status : undefined,
      seatName: filterData.seatName || undefined,
      bankAccountNumber: filterData.bankAccountNumber || undefined,
    };
    onSubmit(formattedData);
    onClose();
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="name">Tên khách hàng</label>
        <Input
          id="name"
          style={{ width: "100%" }}
          value={filterData.name}
          onChange={(e) =>
            setFilterData({ ...filterData, name: e.target.value })
          }
          placeholder="Nhập tên khách hàng"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone">Số điện thoại</label>
        <Input
          id="phone"
          style={{ width: "100%" }}
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
          style={{ width: "100%" }}
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
          <Option value={undefined}>Tất cả</Option>
          <Option value="0">Đã hủy</Option>
          <Option value="5">Chờ xử lý hủy</Option>
        </Select>
      </div>
      <div className="mb-3">
        <label htmlFor="seatName">Tên ghế</label>
        <Input
          id="seatName"
          style={{ width: "100%" }}
          value={filterData.seatName}
          onChange={(e) =>
            setFilterData({ ...filterData, seatName: e.target.value })
          }
          placeholder="Nhập tên ghế"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="bankAccountNumber">Số tài khoản ngân hàng</label>
        <Input
          id="bankAccountNumber"
          style={{ width: "100%" }}
          value={filterData.bankAccountNumber}
          onChange={(e) =>
            setFilterData({ ...filterData, bankAccountNumber: e.target.value })
          }
          placeholder="Nhập số tài khoản ngân hàng"
        />
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

export default FilterButtonTicketCancel;
