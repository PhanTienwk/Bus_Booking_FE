import React, { useState } from "react";
import { Button, Input, Select, DatePicker, Space } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const FilterButtonTicketCancel = ({ onClose, onSubmit }) => {
  const [filterData, setFilterData] = useState({
    name: "",
    phone: "",
    email: "",
    status: undefined,
    seatName: "",
    bankAccountNumber: "",
    minAmount: "",
    maxAmount: "",
    timeRange: null,
  });

  const handleSubmit = () => {
    const formattedData = {
      name: filterData.name.trim() || undefined,
      phone: filterData.phone.trim() || undefined,
      email: filterData.email.trim() || undefined,
      status:
        filterData.status !== undefined
          ? parseInt(filterData.status)
          : undefined,
      seatName: filterData.seatName.trim() || undefined,
      bankAccountNumber: filterData.bankAccountNumber.trim() || undefined,
      minAmount: filterData.minAmount
        ? parseFloat(filterData.minAmount)
        : undefined,
      maxAmount: filterData.maxAmount
        ? parseFloat(filterData.maxAmount)
        : undefined,
      startTime: filterData.timeRange
        ? filterData.timeRange[0].toISOString()
        : undefined,
      endTime: filterData.timeRange
        ? filterData.timeRange[1].toISOString()
        : undefined,
    };

    // // Kiểm tra ít nhất một tiêu chí lọc
    // if (
    //   !formattedData.name &&
    //   !formattedData.phone &&
    //   !formattedData.email &&
    //   formattedData.status === undefined &&
    //   !formattedData.seatName &&
    //   !formattedData.bankAccountNumber &&
    //   !formattedData.minAmount &&
    //   !formattedData.maxAmount &&
    //   !formattedData.startTime &&
    //   !formattedData.endTime
    // ) {
    //   alert("Vui lòng cung cấp ít nhất một tiêu chí lọc!");
    //   return;
    // }

    // // Kiểm tra định dạng email
    // if (
    //   formattedData.email &&
    //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedData.email)
    // ) {
    //   alert("Email không hợp lệ!");
    //   return;
    // }

    // // Kiểm tra số điện thoại
    // if (formattedData.phone && !/^\d{10,11}$/.test(formattedData.phone)) {
    //   alert("Số điện thoại phải là 10 hoặc 11 chữ số!");
    //   return;
    // }

    // // Kiểm tra minAmount và maxAmount
    // if (
    //   (formattedData.minAmount && isNaN(formattedData.minAmount)) ||
    //   (formattedData.maxAmount && isNaN(formattedData.maxAmount))
    // ) {
    //   alert("Khoản tiền phải là số hợp lệ!");
    //   return;
    // }

    // if (
    //   formattedData.minAmount &&
    //   formattedData.maxAmount &&
    //   formattedData.minAmount > formattedData.maxAmount
    // ) {
    //   alert("Khoản tiền tối thiểu không được lớn hơn khoản tiền tối đa!");
    //   return;
    // }

    // // Kiểm tra khoảng thời gian
    // if (
    //   formattedData.startTime &&
    //   formattedData.endTime &&
    //   new Date(formattedData.startTime) > new Date(formattedData.endTime)
    // ) {
    //   alert("Thời gian bắt đầu không được muộn hơn thời gian kết thúc!");
    //   return;
    // }

    console.log("Dữ liệu gửi đi:", JSON.stringify(formattedData, null, 2));
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
      <div className="mb-3">
        <label>Khoản tiền (VND)</label>
        <div>
          <Space>
            <Input
              id="minAmount"
              style={{ width: 230 }}
              type="number"
              value={filterData.minAmount}
              onChange={(e) =>
                setFilterData({ ...filterData, minAmount: e.target.value })
              }
              placeholder="Tối thiểu"
            />
            <Input
              id="maxAmount"
              style={{ width: 230 }}
              type="number"
              value={filterData.maxAmount}
              onChange={(e) =>
                setFilterData({ ...filterData, maxAmount: e.target.value })
              }
              placeholder="Tối đa"
            />
          </Space>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="timeRange">Khoảng thời gian khởi hành</label>
        <RangePicker
          id="timeRange"
          style={{ width: "100%" }}
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          value={filterData.timeRange}
          onChange={(dates) =>
            setFilterData({ ...filterData, timeRange: dates })
          }
          placeholder={["Thời gian bắt đầu", "Thời gian kết thúc"]}
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
          allowClear
        >
          <Option value={undefined}>Tất cả</Option>
          <Option value={0}>Đã hủy</Option>
          <Option value={5}>Chờ xử lý hủy</Option>
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

export default FilterButtonTicketCancel;
