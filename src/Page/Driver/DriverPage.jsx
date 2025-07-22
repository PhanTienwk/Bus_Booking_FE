import DriverSidebar from "../../components/DriverSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { useState, useEffect } from "react";
import "./DriverPage.css";

import { Modal, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Table, Typography as AntTypography, DatePicker, Select } from "antd";

import { getScheduleByDriverAndDateRange } from "../../services/DriverService";

const UserManagement = () => {
  const username = "Tài xế Dũng";
  const [activeIndex, setActiveIndex] = useState(0);
  const { Text } = AntTypography;

  dayjs.locale("vi");
  const { Option } = Select;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

    const driverId = 1;
    const startDate = "2025-06-29T23:59:59";
    const endDate = "2025-07-27T23:59:59";

    getScheduleByDriverAndDateRange(driverId, startDate, endDate)
      .then((response) => {
        console.log("Lịch làm việc của tài xế:", response.data);
      })
      .catch((error) => {
        console.error("Lỗi không thể lấy lịch làm việc:", error);
      });
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

  const addTrip = (
    day,
    startHour,
    endHour,
    routeName,
    fromAddress,
    toAddress,
    licensePlate,
    startTime,
    endTime
  ) => {
    const baseTripInfo = {
      routeName,
      fromAddress,
      toAddress,
      licensePlate,
      timeRange: `${startTime} - ${endTime}`,
    };

    if (startHour <= endHour) {
      const tripInfo = { ...baseTripInfo, daySplit: "full" };
      for (let i = startHour; i < endHour; i++) {
        scheduleData[i][day] = tripInfo;
      }
    } else {
      const firstPart = 24 - startHour;
      const secondPart = endHour;
      const isFirstLonger = firstPart >= secondPart;

      const nextDayMap = {
        monday: "tuesday",
        tuesday: "wednesday",
        wednesday: "thursday",
        thursday: "friday",
        friday: "saturday",
        saturday: "sunday",
        sunday: "monday",
      };
      const nextDay = nextDayMap[day];

      for (let i = startHour; i < 24; i++) {
        scheduleData[i][day] = {
          ...baseTripInfo,
          daySplit: isFirstLonger ? "primary" : "secondary",
        };
      }

      for (let i = 0; i < endHour; i++) {
        scheduleData[i][nextDay] = {
          ...baseTripInfo,
          daySplit: isFirstLonger ? "secondary" : "primary",
        };
      }
    }
  };

  addTrip(
    "monday",
    9,
    18,
    "BX Miền Đông - BX Cần Thơ",
    "286 Đinh Bộ Lĩnh, Bình Thạnh",
    "KDC Hưng Phú, Q.Cái Răng",
    "51B-123.45",
    "09:00",
    "17:30"
  );

  addTrip(
    "tuesday",
    11,
    20,
    "BX An Sương - BX Vũng Tàu",
    "QL22, Hóc Môn",
    "15 Lê Hồng Phong, Vũng Tàu",
    "51B-456.78",
    "11:00",
    "20:00"
  );

  addTrip(
    "wednesday",
    7,
    16,
    "BX Chợ Lớn - BX Long Khánh",
    "209 Hồng Bàng, Q.5",
    "QL1A, Long Khánh, Đồng Nai",
    "51B-789.00",
    "07:00",
    "16:00"
  );

  addTrip(
    "thursday",
    13,
    21,
    "BX Miền Tây - BX Bến Tre",
    "395 Kinh Dương Vương, Q.Bình Tân",
    "QL60, TP. Bến Tre",
    "51B-234.56",
    "13:00",
    "21:00"
  );

  addTrip(
    "friday",
    6,
    13,
    "BX An Sương - BX Biên Hòa",
    "QL22, Hóc Môn",
    "Ngã 4 Vũng Tàu, Biên Hòa",
    "51B-678.90",
    "06:00",
    "13:00"
  );

  addTrip(
    "saturday",
    14,
    2,
    "BX Miền Đông - BX Tây Ninh",
    "286 Đinh Bộ Lĩnh, Bình Thạnh",
    "Khu phố 4, P.3, TP. Tây Ninh",
    "51B-111.22",
    "14:00",
    "2:00"
  );

  addTrip(
    "sunday",
    8,
    19,
    "BX Cần Thơ - BX Sài Gòn",
    "KDC Hưng Phú, Q.Cái Răng",
    "Bến xe Miền Đông mới",
    "51B-333.44",
    "08:00",
    "19:00"
  );

  const handleViewPassengers = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  function renderMergedColumn(dayKey) {
    return (text, row, index) => {
      const trip = text;

      if (!trip) {
        return {
          children: "",
          props: {
            rowSpan: 1,
            className: "empty-cell",
          },
        };
      }

      if (trip.daySplit === "secondary") {
        if (
          index > 0 &&
          JSON.stringify(scheduleData[index - 1][dayKey]) ===
            JSON.stringify(trip)
        ) {
          return {
            children: null,
            props: {
              rowSpan: 0,
            },
          };
        }

        let rowSpan = 1;
        for (let i = index + 1; i < scheduleData.length; i++) {
          if (
            JSON.stringify(scheduleData[i][dayKey]) === JSON.stringify(trip)
          ) {
            rowSpan++;
          } else {
            break;
          }
        }

        return {
          children: <div></div>,
          props: {
            rowSpan,
            style: {
              backgroundColor: "#e0ecef",
              border: "1px solid #d9d9d9",
            },
          },
        };
      }

      let rowSpan = 1;
      for (let i = index + 1; i < scheduleData.length; i++) {
        if (JSON.stringify(scheduleData[i][dayKey]) === JSON.stringify(trip)) {
          rowSpan++;
        } else {
          break;
        }
      }

      if (
        index > 0 &&
        JSON.stringify(scheduleData[index - 1][dayKey]) === JSON.stringify(trip)
      ) {
        return { children: null, props: { rowSpan: 0 } };
      }

      return {
        children: (
          <div
            style={{
              color: "#4d4d4d",
              lineHeight: 1.4,
            }}
          >
            <p>
              <strong>{trip.routeName}</strong>
            </p>
            <p>🚐 {trip.licensePlate}</p>
            <p>🕒 {trip.timeRange}</p>
            <p>
              📍 {trip.fromAddress} → {trip.toAddress}
            </p>
            <button
              style={{
                marginTop: 4,
                color: "#ffffff",
                fontWeight: 500,
                background: "#2fa4e7",
                border: "none",
                borderRadius: 7,
                padding: "4px 8px",
                cursor: "pointer",
              }}
              onClick={() => handleViewPassengers(trip)}
            >
              Danh sách vé
            </button>
          </div>
        ),
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
      width: 95,
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
            LỊCH CHẠY XE CỦA TÀI XẾ
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
      <Modal
        title="Danh sách hành khách"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        {selectedTrip && (
          <div>
            <p>
              <strong>Tuyến:</strong> {selectedTrip.routeName}
            </p>
            <p>
              <strong>Biển số:</strong> {selectedTrip.licensePlate}
            </p>
            <p>
              <strong>Thời gian:</strong> {selectedTrip.timeRange}
            </p>
            <hr />
            <p>→ (Dữ liệu hành khách sẽ hiển thị tại đây sau)</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
