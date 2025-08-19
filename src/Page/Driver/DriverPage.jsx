import DriverSidebar from "../../components/DriverSidebar";
import AdminTopbar from "../../components/AdminTopbar";
import { useState, useEffect } from "react";
import "./DriverPage.css";

import { Modal, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import isBetween from "dayjs/plugin/isBetween";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { Table, Typography as AntTypography, DatePicker, Select } from "antd";

import {
  getMyInfo,
  getScheduleByDriverAndDateRange,
} from "../../services/DriverService";

import {
  getUserInfor,
} from "../../services/UserService";

import { handleGetPassengerTripInfo } from "../../services/BusTripService";
import DriverInformation from "./DriverInformation";

const UserManagement = () => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { Text } = AntTypography;

  dayjs.locale("vi");
  const { Option } = Select;
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [seatList, setSeatList] = useState([]);

  dayjs.extend(isBetween);

  useEffect(() => {
    getMyInfo()
      .then((res) => {
        console.log("Thông tin người dùng:", res.result);
        setUserInfo(res.result);
      })
      .catch((err) => {
        console.error("Lỗi lấy thông tin người dùng:", err);
      });
  }, []);

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await getUserInfor();
          if (response?.code === 1000) {
            const result = response.result;
            setUsername(result.name || result.email || "Admin");
            setAvatar(result.avatar || "");
          } else {
            setUsername("Admin");
            setAvatar("");
            console.error("Không lấy được thông tin user:", response.message);
          }
        } catch (error) {
          console.error("Lỗi khi gọi API getUserInfor:", error);
          setUsername("Admin");
          setAvatar("");
        }
      };
  
      fetchUserData();
    }, []);
  

  useEffect(() => {
    if (!userInfo) return;

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

    if (result.length > 0) {
      const today = dayjs();
      const matchedWeek = result.find((week) => {
        const [startStr, endStr] = week.value.split("_");
        const start = dayjs(startStr);
        const end = dayjs(endStr);
        return today.isBetween(start, end, "day", "[]");
      });

      if (matchedWeek) {
        setSelectedWeek(matchedWeek.value);
      } else {
        setSelectedWeek(result[0].value);
      }
    }
  }, [selectedMonth, userInfo]);

  useEffect(() => {
    if (!userInfo || !selectedWeek) return;

    const [startDateStr, endDateStr] = selectedWeek.split("_");
    const startDate = dayjs(startDateStr).startOf("day").toISOString();
    const endDate = dayjs(endDateStr).endOf("day").toISOString();

    console.log("StartDate:", startDate);
    console.log("EndDate:", endDate);

    getScheduleByDriverAndDateRange(userInfo.id, startDate, endDate)
      .then((response) => {
        const trips = response.result;

        if (Array.isArray(trips)) {
          setScheduleData(generateEmptySchedule());

          trips.forEach((trip) => {
            const startDateTime = dayjs(trip.departureTime);
            const endDateTime = startDateTime.add(trip.estimatedHours, "hour");

            const dayKeys = [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
            ];
            const day = dayKeys[startDateTime.day()];
            const start = Number(startDateTime.format("HH"));

            const hour = endDateTime.hour();
            const minute = endDateTime.minute();
            const end = minute === 0 ? hour : hour + 1;

            const startTime = startDateTime.format("HH:mm");
            const endTime = endDateTime.format("HH:mm");

            addTrip(
              trip.busType.id,
              trip.tripId,
              day,
              start,
              end,
              trip.routeName,
              trip.departureStationAddress,
              trip.arrivalStationAddress,
              trip.licensePlate,
              startTime,
              endTime
            );
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi không thể lấy lịch làm việc:", error);
      });
  }, [selectedWeek, userInfo]);

  const generateEmptySchedule = () =>
    Array.from({ length: 24 }, (_, i) => ({
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

  const [scheduleData, setScheduleData] = useState(generateEmptySchedule());

  const addTrip = (
    busType,
    tripId,
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
      busType,
      tripId,
      routeName,
      fromAddress,
      toAddress,
      licensePlate,
      timeRange: `${startTime} - ${endTime}`,
    };

    setScheduleData((prevData) => {
      const updated = [...prevData.map((row) => ({ ...row }))];

      if (startHour <= endHour) {
        const tripInfo = { ...baseTripInfo, daySplit: "full" };
        for (let i = startHour; i < endHour; i++) {
          updated[i][day] = tripInfo;
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
          updated[i][day] = {
            ...baseTripInfo,
            daySplit: isFirstLonger ? "primary" : "secondary",
          };
        }

        for (let i = 0; i < endHour; i++) {
          updated[i][nextDay] = {
            ...baseTripInfo,
            daySplit: isFirstLonger ? "secondary" : "primary",
          };
        }
      }

      return updated;
    });
  };

  const handleViewPassengers = async (trip) => {
    console.log("Thông tin chuyến xe được click:", trip);

    setSelectedTrip(trip);
    setShowModal(true);

    try {
      const res = await handleGetPassengerTripInfo(trip.tripId);
      setSeatList(res.result);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách ghế:", err);
      setSeatList([]);
    }
  };

  const upperSeats = seatList.filter((seat) => seat.seatName.startsWith("A"));
  const lowerSeats = seatList.filter((seat) => seat.seatName.startsWith("B"));

  const renderSeat = (seat) => {
    const seatImage = seat.booked
      ? "/images/seat_active.svg"
      : "/images/seat_disabled.svg";

    return (
      <div key={seat.seatName} className="flex flex-col items-center">
        <img src={seatImage} alt={seat.seatName} className="w-8 h-8" />
        <span className="text-[13px] mt-1">{seat.seatName}</span>
      </div>
    );
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

  const renderContent = () => {
    switch (activeIndex) {
      case 1:
        return <DriverInformation />;
      case 0:
      default:
        return (
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
    }
  };

  return (
    <div className="flex">
      <DriverSidebar
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <main className="ml-64 w-full bg-gray-50 min-h-screen">
        <AdminTopbar username={username} avatar={avatar} />
        {renderContent()}
      </main>
      <Modal
        title="Danh sách hành khách"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        {selectedTrip && (
          <div id="print-area">
            <p>
              <strong>Tuyến:</strong> {selectedTrip.routeName}
            </p>
            <p>
              <strong>Biển số:</strong> {selectedTrip.licensePlate}
            </p>
            <p>
              <strong>Thời gian:</strong> {selectedTrip.timeRange}
            </p>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6 ml-2">
              <div>
                <h4 className="text-sm font-semibold mb-4 text-center">
                  Tầng trên
                </h4>
                <div
                  className={`grid ${
                    selectedTrip?.busType === 2 ? "grid-cols-2" : "grid-cols-3"
                  } gap-2`}
                >
                  {upperSeats.map(renderSeat)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-4 text-center">
                  Tầng dưới
                </h4>
                <div
                  className={`grid ${
                    selectedTrip?.busType === 2 ? "grid-cols-2" : "grid-cols-3"
                  } gap-2`}
                >
                  {lowerSeats.map(renderSeat)}
                </div>
              </div>

              <div className="ml-6">
                <h4 className="text-sm font-semibold mb-4">Ghi chú</h4>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 bg-gray-300 rounded"
                      style={{
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    ></div>
                    <span>Ghế trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 bg-blue-100 rounded"
                      style={{
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact",
                      }}
                    ></div>
                    <span>Có khách</span>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-4" />
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="px-4 py-2 border">STT</th>
                    <th className="px-4 py-2 border">Số ghế</th>
                    <th className="px-4 py-2 border">Họ tên</th>
                    <th className="px-4 py-2 border">SĐT</th>
                    {/* <th className="px-4 py-2 border">Điểm lên</th>
                    <th className="px-4 py-2 border">Điểm xuống</th> */}
                  </tr>
                </thead>
                <tbody>
                  {seatList
                    .filter((seat) => seat.booked)
                    .map((seat, index) => (
                      <tr key={seat.seatName} className="border-t">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border font-semibold">
                          {seat.seatName}
                        </td>
                        <td className="px-4 py-2 border">{seat.name}</td>
                        <td className="px-4 py-2 border">{seat.phone}</td>
                        {/* <td className="px-4 py-2 border">{seat.pickupPoint}</td>
                        <td className="px-4 py-2 border">
                          {seat.dropOffPoint}
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <hr className="my-4" />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => window.print()}
              >
                In danh sách
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
