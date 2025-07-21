import React, { useState } from "react";
import { Button, Input, Select, DatePicker } from "antd";
import moment from "moment";

const { Option } = Select;

const FilterButtonBusTrip = ({
  onClose,
  onSubmit,
  busRoutes,
  buses,
  drivers,
}) => {
  const [filterData, setFilterData] = useState({
    id: "",
    busRouteId: undefined,
    departureTime: null,
    busId: undefined,
    driverId: undefined,
    status: undefined,
  });

  const handleSubmit = () => {
    const formattedData = {
      id: filterData.id ? parseInt(filterData.id) : undefined,
      busRouteId: filterData.busRouteId || undefined,
      departureTime: filterData.departureTime
        ? filterData.departureTime.toISOString()
        : undefined,
      busId: filterData.busId || undefined,
      driverId: filterData.driverId || undefined,
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
    <div style={{ width: 400 }}>
      <div className="mb-3">
        <label htmlFor="id">ID Chuyến Xe</label>
        <Input
          id="id"
          style={{ width: "100%" }}
          value={filterData.id}
          onChange={(e) => setFilterData({ ...filterData, id: e.target.value })}
          placeholder="Nhập ID chuyến xe"
          type="number"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="busRouteId">Tuyến xe</label>
        <Select
          id="busRouteId"
          style={{ width: "100%" }}
          value={filterData.busRouteId}
          onChange={(value) =>
            setFilterData({ ...filterData, busRouteId: value })
          }
          placeholder="Chọn tuyến xe"
          showSearch
          filterOption={(input, option) =>
            (option.children || "").toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value={undefined}>Tất cả</Option>
          {busRoutes.map((route) => (
            <Option key={route.id} value={route.id}>
              {`${route.busStationFrom?.name} - ${route.busStationTo?.name}`}
            </Option>
          ))}
        </Select>
      </div>
      <div className="mb-3">
        <label htmlFor="departureTime">Thời gian khởi hành</label>
        <DatePicker
          id="departureTime"
          style={{ width: "100%" }}
          showTime
          format="DD/MM/YYYY HH:mm"
          value={filterData.departureTime}
          onChange={(date) =>
            setFilterData({ ...filterData, departureTime: date })
          }
          placeholder="Chọn thời gian khởi hành"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="busId">Xe</label>
        <Select
          id="busId"
          style={{ width: "100%" }}
          value={filterData.busId}
          onChange={(value) => setFilterData({ ...filterData, busId: value })}
          placeholder="Chọn xe"
          showSearch
          filterOption={(input, option) =>
            (option.children || "").toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value={undefined}>Tất cả</Option>
          {buses.map((bus) => (
            <Option key={bus.id} value={bus.id}>
              {bus.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="mb-3">
        <label htmlFor="driverId">Tài xế</label>
        <Select
          id="driverId"
          style={{ width: "100%" }}
          value={filterData.driverId}
          onChange={(value) =>
            setFilterData({ ...filterData, driverId: value })
          }
          placeholder="Chọn tài xế"
          showSearch
          filterOption={(input, option) =>
            (option.children || "").toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value={undefined}>Tất cả</Option>
          {drivers.map((driver) => (
            <Option key={driver.id} value={driver.id}>
              {driver.name}
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

export default FilterButtonBusTrip;
