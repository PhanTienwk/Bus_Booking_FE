import DriverSidebar from "../../components/DriverSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { useState, useEffect } from "react";
import "./DriverPage.css";

import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Table, Typography as AntTypography, DatePicker, Select } from "antd";

const UserManagement = () => {
  const username = "Tài xế Dũng";
  const [activeIndex, setActiveIndex] = useState(0);
  const { Text } = AntTypography;

  dayjs.locale("vi");
  const { Option } = Select;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  useEffect(() => {
    const startOfMonth = selectedMonth.startOf("month");
    const endOfMonth = selectedMonth.endOf("month");

    let current = startOfMonth.startOf("week");
    const result = [];

    let weekIndex = 1;
    while (current.isBefore(endOfMonth)) {
      const start = current;
      const end = current.endOf("week");

      result.push({
        label: `Tuần ${weekIndex} (${start.format("DD/MM")} - ${end.format(
          "DD/MM"
        )})`,
        value: `${start.format("YYYY-MM-DD")}_${end.format("YYYY-MM-DD")}`,
      });

      current = current.add(1, "week");
      weekIndex++;
    }

    setWeeks(result);
    setSelectedWeek(null);
  }, [selectedMonth]);

  const hours = Array.from({ length: 24 }, (_, i) => ({
    key: `${i}`,
    time: `${String(i).padStart(2, "0")}:00 - ${String(i + 1).padStart(
      2,
      "0"
    )}:00`,
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  }));

  const scheduleData = [...hours];

  const addTrip = (day, startHour, endHour, vehicle, from, to, startTime) => {
    for (let i = startHour; i < endHour; i++) {
      scheduleData[i][day] = `${vehicle}\n${from} → ${to}\n${startTime}`;
    }
  };

  addTrip(
    "monday",
    9,
    15,
    "51B-123.45",
    "Bến xe Miền Đông",
    "Bến xe Cần Thơ",
    "09:00"
  );
  addTrip(
    "tuesday",
    11,
    17,
    "51B-456.78",
    "Bến xe An Sương",
    "Bến xe Vũng Tàu",
    "11:00"
  );
  addTrip(
    "wednesday",
    7,
    12,
    "51B-789.00",
    "Bến xe Chợ Lớn",
    "Bến xe Long Khánh",
    "07:00"
  );

  addTrip(
    "thursday",
    13,
    18,
    "51B-234.56",
    "Bến xe Miền Tây",
    "Bến xe Bến Tre",
    "13:00"
  );

  addTrip(
    "friday",
    6,
    10,
    "51B-678.90",
    "Bến xe An Sương",
    "Bến xe Biên Hòa",
    "06:00"
  );

  addTrip(
    "saturday",
    14,
    20,
    "51B-111.22",
    "Bến xe Miền Đông",
    "Bến xe Tây Ninh",
    "14:00"
  );

  addTrip(
    "sunday",
    8,
    13,
    "51B-333.44",
    "Bến xe Cần Thơ",
    "Bến xe Sài Gòn",
    "08:00"
  );

  function renderMergedColumn(dayKey) {
    return (text, row, index) => {
      const currentText = text;

      if (!currentText) {
        return {
          children: "",
          props: {
            rowSpan: 1,
            className: "empty-cell",
          },
        };
      }

      let rowSpan = 1;
      for (let i = index + 1; i < scheduleData.length; i++) {
        if (scheduleData[i][dayKey] === currentText) {
          rowSpan++;
        } else {
          break;
        }
      }

      if (index > 0 && scheduleData[index - 1][dayKey] === currentText) {
        return { children: null, props: { rowSpan: 0 } };
      }

      return {
        children: currentText,
        props: {
          rowSpan,
          className: "trip-cell",
        },
      };
    };
  }

  const columns = [
    {
      title: "Khung giờ",
      dataIndex: "time",
      key: "time",
      fixed: "left",
      width: 120,
      align: "center",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Thứ 2",
      dataIndex: "monday",
      key: "monday",
      width: 120,
      align: "center",
      render: renderMergedColumn("monday"),
    },
    {
      title: "Thứ 3",
      dataIndex: "tuesday",
      key: "tuesday",
      width: 120,
      align: "center",
      render: renderMergedColumn("tuesday"),
    },
    {
      title: "Thứ 4",
      dataIndex: "wednesday",
      key: "wednesday",
      width: 120,
      align: "center",
      render: renderMergedColumn("wednesday"),
    },
    {
      title: "Thứ 5",
      dataIndex: "thursday",
      key: "thursday",
      width: 120,
      align: "center",
      render: renderMergedColumn("thursday"),
    },
    {
      title: "Thứ 6",
      dataIndex: "friday",
      key: "friday",
      width: 120,
      align: "center",
      render: renderMergedColumn("friday"),
    },
    {
      title: "Thứ 7",
      dataIndex: "saturday",
      key: "saturday",
      width: 120,
      align: "center",
      render: renderMergedColumn("saturday"),
    },
    {
      title: "Chủ nhật",
      dataIndex: "sunday",
      key: "sunday",
      width: 120,
      align: "center",
      render: renderMergedColumn("sunday"),
    },
  ];

  const renderContent = () => (
    <Box sx={{ padding: 3 }}>
      <ConfigProvider locale={viVN}>
        <div className="flex gap-4 items-center mb-4">
          <DatePicker
            picker="month"
            onChange={(value) => setSelectedMonth(value)}
            value={selectedMonth}
            format="MM/YYYY"
            allowClear={false}
            placeholder="Chọn tháng"
          />

          <Select
            style={{ minWidth: 250 }}
            placeholder="Chọn tuần"
            value={selectedWeek}
            onChange={(value) => setSelectedWeek(value)}
          >
            {weeks.map((week) => (
              <Option key={week.value} value={week.value}>
                {week.label}
              </Option>
            ))}
          </Select>
        </div>
      </ConfigProvider>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            LỊCH CHẠY XE THEO GIỜ (00:00 - 24:00)
          </Typography>
          <div style={{ overflowX: "auto" }}>
            <Table
              columns={columns}
              dataSource={scheduleData}
              pagination={false}
              bordered
              scroll={{ x: true }}
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <div className="flex">
      <DriverSidebar
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} />
        {renderContent()}
      </main>
    </div>
  );
};

export default UserManagement;
