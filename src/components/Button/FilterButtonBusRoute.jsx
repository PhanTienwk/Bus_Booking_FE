import React, { useState } from "react";
import { Button, Select, Input } from "antd";

const { Option } = Select;

const FilterButtonBusRoute = ({ onClose, onSubmit, busStations: allBusStations }) => {
  const [filterData, setFilterData] = useState({
    from: undefined,
    to: undefined,
    distance: "",
    travelTime: "",
    status: undefined,
  });

  const handleSubmit = () => {
    const formattedData = {
      from: filterData.from || undefined,
      to: filterData.to || undefined,
      distance: filterData.distance ? parseFloat(filterData.distance) : undefined,
      travelTime: filterData.travelTime ? parseFloat(filterData.travelTime) : undefined,
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
        <label>Bến đi</label>
        <Select
          style={{ width: "100%" }}
          value={filterData.from}
          onChange={(value) => setFilterData({ ...filterData, from: value })}
          placeholder="Chọn bến đi"
          allowClear
        >
          {allBusStations?.map((bs) => (
            <Option key={bs.id} value={bs.name}>
              {bs.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mb-3">
        <label>Bến đến</label>
        <Select
          style={{ width: "100%" }}
          value={filterData.to}
          onChange={(value) => setFilterData({ ...filterData, to: value })}
          placeholder="Chọn bến đến"
          allowClear
        >
          {allBusStations?.map((bs) => (
            <Option key={bs.id} value={bs.name}>
              {bs.name}
            </Option>
          ))}
        </Select>
      </div>

      <div className="mb-3">
        <label>Khoảng cách (km)</label>
        <Input
          type="number"
          value={filterData.distance}
          onChange={(e) =>
            setFilterData({ ...filterData, distance: e.target.value })
          }
          placeholder="Nhập khoảng cách"
        />
      </div>

      <div className="mb-3">
        <label>Thời gian (giờ)</label>
        <Input
          type="number"
          value={filterData.travelTime}
          onChange={(e) =>
            setFilterData({ ...filterData, travelTime: e.target.value })
          }
          placeholder="Nhập thời gian"
        />
      </div>

      <div className="mb-3">
        <label>Trạng thái</label>
        <Select
          style={{ width: "100%" }}
          value={filterData.status}
          onChange={(value) =>
            setFilterData({ ...filterData, status: value })
          }
          placeholder="Chọn trạng thái"
        >
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

export default FilterButtonBusRoute;
