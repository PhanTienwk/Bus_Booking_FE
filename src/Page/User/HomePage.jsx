import React, { useState, useEffect } from "react";
import Select from "react-select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleGetAllProvince } from "../../services/BusStationService";
import { searchTripsByProvinces } from "../../services/HomeService";
import { DatePicker, ConfigProvider, Select as AntSelect } from "antd";
import viVN from "antd/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const HomePage = () => {
  const [provinces, setProvinces] = useState([]);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [selectedTab, setSelectedTab] = useState("departure");
  const [tripType, setTripType] = useState("oneway");
  const [returnDate, setReturnDate] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [trips, setTrips] = useState([]);
  const [tripsReturn, setTripsReturn] = useState([]);
  const [ticketCount, setTicketCount] = useState("1");
  const [routeTitle, setRouteTitle] = useState("");
  const [selectedDepartureTrip, setSelectedDepartureTrip] = useState(null);
  const [selectedReturnTrip, setSelectedReturnTrip] = useState(null);
  const [filters, setFilters] = useState({
    timeRanges: [],
    busTypes: [],
    floors: [],
  });
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const backendDateFormat = "YYYY-MM-DD";
  const displayDateFormat = "DD/MM/YYYY";
  dayjs.locale("vi");

  useEffect(() => {
    if (
      tripType === "roundtrip" &&
      departureDate &&
      returnDate &&
      dayjs(returnDate).isBefore(dayjs(departureDate))
    ) {
      setReturnDate("");
    }
  }, [departureDate, returnDate, tripType]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await handleGetAllProvince();
        const formattedProvinces = response.result.map((province) => ({
          value: province.id,
          label: province.name,
        }));
        setProvinces(formattedProvinces);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
        handleOpenSnackBar("Lỗi khi lấy danh sách tỉnh thành!", "error");
      }
    };
    fetchProvinces();
  }, []);

  const filteredDestinations = provinces.filter(
    (province) => province.value !== (departure?.value || "")
  );

  const filteredDepartures = provinces.filter(
    (province) => province.value !== (destination?.value || "")
  );

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate) {
      handleOpenSnackBar(
        "Vui lòng chọn điểm đi, điểm đến và ngày đi!",
        "error"
      );
      return;
    }

    if (tripType === "roundtrip") {
      const responseReturn = await searchTripsByProvinces(
        destination.value,
        departure.value,
        returnDate,
        ticketCount
      );
      setTripsReturn(responseReturn.result);
    }

    setSelectedTab("departure");

    try {
      const response = await searchTripsByProvinces(
        departure.value,
        destination.value,
        departureDate,
        ticketCount
      );
      setTrips(response.result);
      setShowSearchResults(true);
      setRouteTitle(
        `${departure.label} - ${destination.label} (${response.result.length})`
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chuyến xe:", error);
      handleOpenSnackBar(
        "Không tìm thấy chuyến xe. Vui lòng thử lại!",
        "error"
      );
    }
  };

  useEffect(() => {
    if (
      tripType === "roundtrip" &&
      selectedDepartureTrip &&
      selectedReturnTrip
    ) {
      navigate(`/seat-selection/${selectedDepartureTrip.id}`, {
        state: {
          tripDetails: selectedDepartureTrip,
          returnTrip: selectedReturnTrip,
        },
      });
    }
  }, [tripType, selectedDepartureTrip, selectedReturnTrip, navigate]);

  const calculateArrivalTime = (departureTime, travelTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(departure);
    const hours = Math.floor(travelTime);
    const minutes = Math.round((travelTime % 1) * 60);
    arrival.setHours(departure.getHours() + hours);
    arrival.setMinutes(departure.getMinutes() + minutes);
    return arrival.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTimeRangeFilter = (range) => {
    setFilters((prev) => ({
      ...prev,
      timeRanges: prev.timeRanges.includes(range)
        ? prev.timeRanges.filter((r) => r !== range)
        : [...prev.timeRanges, range],
    }));
  };

  const handleBusTypeFilter = (type) => {
    setFilters((prev) => ({
      ...prev,
      busTypes: prev.busTypes.includes(type)
        ? prev.busTypes.filter((t) => t !== type)
        : [...prev.busTypes, type],
    }));
  };

  const handleFloorFilter = (floor) => {
    setFilters((prev) => ({
      ...prev,
      floors: prev.floors.includes(floor)
        ? prev.floors.filter((f) => f !== floor)
        : [...prev.floors, floor],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      timeRanges: [],
      busTypes: [],
      floors: [],
    });
    handleOpenSnackBar("Đã xóa tất cả bộ lọc", "success");
  };

  const getTripCountByTimeRange = (range) => {
    return trips.filter((trip) => {
      const departureHour = new Date(trip.departureTime).getHours();
      if (range === "earlyMorning" && departureHour >= 0 && departureHour < 6)
        return true;
      if (range === "morning" && departureHour >= 6 && departureHour < 12)
        return true;
      if (range === "afternoon" && departureHour >= 12 && departureHour < 18)
        return true;
      if (range === "evening" && departureHour >= 18 && departureHour <= 23)
        return true;
      return false;
    }).length;
  };

  const getTripCountByFloor = (floor) => {
    return trips.filter((trip) => {
      if (floor === "Tầng trên" && trip.countA >= parseInt(ticketCount))
        return true;
      if (floor === "Tầng dưới" && trip.countB >= parseInt(ticketCount))
        return true;
      return false;
    }).length;
  };

  const filterTrips = (trips) => {
    return trips.filter((trip) => {
      let passTimeFilter = true;
      if (filters.timeRanges.length > 0) {
        const departureHour = new Date(trip.departureTime).getHours();
        passTimeFilter = filters.timeRanges.some((range) => {
          if (
            range === "earlyMorning" &&
            departureHour >= 0 &&
            departureHour < 6
          )
            return true;
          if (range === "morning" && departureHour >= 6 && departureHour < 12)
            return true;
          if (
            range === "afternoon" &&
            departureHour >= 12 &&
            departureHour < 18
          )
            return true;
          if (range === "evening" && departureHour >= 18 && departureHour <= 23)
            return true;
          return false;
        });
      }

      const passBusTypeFilter =
        filters.busTypes.length === 0 ||
        filters.busTypes.includes(trip.bus.busType.name);

      let passFloorFilter = true;
      if (filters.floors.length > 0) {
        if (
          filters.floors.includes("Tầng trên") &&
          filters.floors.includes("Tầng dưới")
        ) {
          passFloorFilter = trip.countA + trip.countB >= parseInt(ticketCount);
        } else {
          passFloorFilter = filters.floors.some((floor) => {
            if (floor === "Tầng trên" && trip.countA >= parseInt(ticketCount))
              return true;
            if (floor === "Tầng dưới" && trip.countB >= parseInt(ticketCount))
              return true;
            return false;
          });
        }
      } else {
        passFloorFilter = trip.countA + trip.countB >= parseInt(ticketCount);
      }

      return passTimeFilter && passBusTypeFilter && passFloorFilter;
    });
  };

  const filteredTrips = filterTrips(
    selectedTab === "departure" ? trips : tripsReturn
  );

  useEffect(() => {
    if (showSearchResults && departure && destination) {
      setRouteTitle(
        `${departure.label} - ${destination.label} (${filteredTrips.length})`
      );
    }
  }, [filteredTrips, departure, destination, showSearchResults]);

  return (
    <ConfigProvider locale={viVN}>
      <div>
        <Header />

        <section className="bg-white">
          <div className="max-w-6xl mx-auto">
            <img
              src="/images/home_background.png"
              alt="Banner quảng cáo dịch vụ xe khách FUTA"
              className="rounded-xl shadow-lg mt-6 w-full"
            />
          </div>
        </section>

        <section className="bg-white relative">
          <div className="max-w-6xl mx-auto mt-6 mb-3 rounded-xl border-[8px] border-[#AA2E081A] shadow-sm">
            <div className="rounded-[0.4rem] border border-[#EF5222]">
              <div className="flex justify-between items-center mb-4 pt-6 md:px-8">
                <div className="flex gap-6 text-base text-[#EF5222]">
                  <label
                    className={`flex items-center gap-1 ${
                      tripType === "oneway" ? "text-[#EF5222]" : "text-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="oneway"
                      checked={tripType === "oneway"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="accent-[#EF5222]"
                    />
                    Một chiều
                  </label>

                  <label
                    className={`flex items-center gap-1 ${
                      tripType === "roundtrip"
                        ? "text-[#EF5222]"
                        : "text-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="roundtrip"
                      checked={tripType === "roundtrip"}
                      onChange={(e) => setTripType(e.target.value)}
                      className="accent-[#EF5222]"
                    />
                    Khứ hồi
                  </label>
                </div>
                <a href="/" className="text-base text-[#EF5222]">
                  Hướng dẫn mua vé
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 py-4 md:px-8 mb-[35px]">
                <Select
                  options={filteredDepartures}
                  value={departure}
                  onChange={setDeparture}
                  placeholder="Điểm đi"
                  className="w-full"
                  classNamePrefix="select"
                  isSearchable
                  styles={{
                    container: (base) => ({ ...base, width: "100%" }),
                    control: (base, state) => ({
                      ...base,
                      height: "100%",
                      minHeight: "48px",
                      borderColor: state.isFocused ? "#1677ff" : "#d9d9d9",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(5, 145, 255, 0.1)"
                        : "none",
                      "&:hover": {
                        borderColor: "#1677ff",
                      },
                    }),
                  }}
                />
                <Select
                  options={filteredDestinations}
                  value={destination}
                  onChange={setDestination}
                  placeholder="Điểm đến"
                  className="w-full"
                  classNamePrefix="select"
                  isSearchable
                  styles={{
                    container: (base) => ({ ...base, width: "100%" }),
                    control: (base, state) => ({
                      ...base,
                      height: "100%",
                      minHeight: "48px",
                      borderColor: state.isFocused ? "#1677ff" : "#d9d9d9",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(5, 145, 255, 0.1)"
                        : "none",
                      "&:hover": {
                        borderColor: "#1677ff",
                      },
                    }),
                  }}
                />
                <DatePicker
                  value={
                    departureDate
                      ? dayjs(departureDate, backendDateFormat)
                      : null
                  }
                  onChange={(date, dateString) => {
                    if (!date) {
                      setDepartureDate("");
                    } else {
                      setDepartureDate(
                        dayjs(dateString, displayDateFormat).format(
                          backendDateFormat
                        )
                      );
                    }
                  }}
                  format={displayDateFormat}
                  className="w-full h-[48px]"
                  placeholder="Chọn ngày đi"
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                />
                {tripType === "roundtrip" && (
                  <DatePicker
                    value={
                      returnDate ? dayjs(returnDate, backendDateFormat) : null
                    }
                    onChange={(date, dateString) => {
                      if (!date) {
                        setReturnDate("");
                      } else {
                        setReturnDate(
                          dayjs(dateString, displayDateFormat).format(
                            backendDateFormat
                          )
                        );
                      }
                    }}
                    format={displayDateFormat}
                    className="w-full h-[48px]"
                    placeholder="Chọn ngày về"
                    disabledDate={(current) =>
                      current &&
                      (current < dayjs().startOf("day") ||
                        (departureDate &&
                          current <
                            dayjs(departureDate, backendDateFormat).startOf(
                              "day"
                            )))
                    }
                  />
                )}
                <AntSelect
                  value={ticketCount}
                  onChange={(value) => setTicketCount(value)}
                  options={[
                    { value: "1", label: "1 vé" },
                    { value: "2", label: "2 vé" },
                    { value: "3", label: "3 vé" },
                    { value: "4", label: "4 vé" },
                    { value: "5", label: "5 vé" },
                  ]}
                  className="w-full"
                  size="large"
                  style={{
                    height: 48,
                  }}
                  aria-label="Chọn số lượng vé"
                />
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] z-10">
            <button
              onClick={handleSearch}
              className="bg-[#EF5222] text-white px-[77px] py-3 rounded-full font-semibold hover:brightness-105 shadow-lg"
              aria-label="Tìm kiếm chuyến xe"
            >
              Tìm chuyến xe
            </button>
          </div>
        </section>

        {showSearchResults && (
          <section className="bg-white pt-6 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  {selectedDepartureTrip && (
                    <div className="bg-white rounded-xl shadow p-4 border border-gray-200 mb-4">
                      <h4 className="text-base font-semibold mb-3 border-b pb-2">
                        CHUYẾN ĐI CỦA BẠN
                      </h4>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 rounded bg-gray-400 text-white text-xs flex items-center justify-center">
                          1
                        </div>

                        <div className="flex flex-col text-sm text-gray-800">
                          <p className="font-semibold">
                            {dayjs(selectedDepartureTrip.departureTime).format(
                              "dddd, DD/MM/YYYY"
                            )}
                          </p>
                          <p>
                            {departure?.label} - {destination?.label}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-medium">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-green-600">
                            {dayjs(selectedDepartureTrip.departureTime).format(
                              "HH:mm"
                            )}
                          </p>

                          <div className="text-center text-xs text-gray-400 flex-1">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-600" />
                              <div className="border-t border-dashed border-gray-400 w-10" />
                              <span className="text-gray-500">
                                {selectedDepartureTrip.busRoute.travelTime} giờ
                              </span>
                              <div className="border-t border-dashed border-gray-400 w-10" />
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                          </div>

                          <p className="text-orange-600">
                            {dayjs(selectedDepartureTrip.departureTime)
                              .add(
                                selectedDepartureTrip.busRoute.travelTime,
                                "hour"
                              )
                              .format("HH:mm")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-700">
                          <p>
                            {selectedDepartureTrip.busRoute.busStationFrom.name}
                          </p>
                          <p>
                            {selectedDepartureTrip.busRoute.busStationTo.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedReturnTrip && (
                    <div className="bg-white rounded-xl shadow p-4 border border-gray-200 mb-4">
                      <h4 className="text-base font-semibold mb-3 border-b pb-2">
                        CHUYẾN VỀ CỦA BẠN
                      </h4>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 rounded bg-gray-400 text-white text-xs flex items-center justify-center">
                          2
                        </div>

                        <div className="flex flex-col text-sm text-gray-800">
                          <p className="font-semibold">
                            {dayjs(selectedReturnTrip.departureTime).format(
                              "dddd, DD/MM/YYYY"
                            )}
                          </p>
                          <p>
                            {destination?.label} - {departure?.label}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm font-medium">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-green-600">
                            {dayjs(selectedReturnTrip.departureTime).format(
                              "HH:mm"
                            )}
                          </p>

                          <div className="text-center text-xs text-gray-400 flex-1">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-600" />
                              <div className="border-t border-dashed border-gray-400 w-10" />
                              <span className="text-gray-500">
                                {selectedReturnTrip.busRoute.travelTime} giờ
                              </span>
                              <div className="border-t border-dashed border-gray-400 w-10" />
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                          </div>

                          <p className="text-orange-600">
                            {dayjs(selectedReturnTrip.departureTime)
                              .add(
                                selectedReturnTrip.busRoute.travelTime,
                                "hour"
                              )
                              .format("HH:mm")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-700">
                          <p>
                            {selectedReturnTrip.busRoute.busStationFrom.name}
                          </p>
                          <p>{selectedReturnTrip.busRoute.busStationTo.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">BỘ LỌC TÌM KIẾM</h3>
                      <button
                        className="flex items-center text-red-500 text-base font-medium"
                        onClick={handleClearFilters}
                      >
                        Bỏ lọc
                        <img
                          src="/images/delete.svg"
                          alt="Xóa bộ lọc"
                          className="w-5 h-5 ml-1"
                        />
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="font-medium mb-2">Giờ đi</p>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                          <input
                            type="checkbox"
                            checked={filters.timeRanges.includes(
                              "earlyMorning"
                            )}
                            onChange={() =>
                              handleTimeRangeFilter("earlyMorning")
                            }
                            aria-label="Sáng sớm 00:00 - 06:00"
                          />
                          <span className="ml-2 text-[15px]">
                            Sáng sớm 00:00 - 06:00 (
                            {getTripCountByTimeRange("earlyMorning")})
                          </span>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            checked={filters.timeRanges.includes("morning")}
                            onChange={() => handleTimeRangeFilter("morning")}
                            aria-label="Buổi sáng 06:00 - 12:00"
                          />
                          <span className="ml-2 text-[15px]">
                            Buổi sáng 06:00 - 12:00 (
                            {getTripCountByTimeRange("morning")})
                          </span>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            checked={filters.timeRanges.includes("afternoon")}
                            onChange={() => handleTimeRangeFilter("afternoon")}
                            aria-label="Buổi chiều 12:00 - 18:00"
                          />
                          <span className="ml-2 text-[15px]">
                            Buổi chiều 12:00 - 18:00 (
                            {getTripCountByTimeRange("afternoon")})
                          </span>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            checked={filters.timeRanges.includes("evening")}
                            onChange={() => handleTimeRangeFilter("evening")}
                            aria-label="Buổi tối 18:00 - 24:00"
                          />
                          <span className="ml-2 text-[15px]">
                            Buổi tối 18:00 - 24:00 (
                            {getTripCountByTimeRange("evening")})
                          </span>
                        </li>
                      </ul>
                    </div>

                    <hr className="my-4 border-t border-gray-300" />

                    <div className="mb-4">
                      <p className="font-medium mb-2">Loại xe</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className={`px-3 py-1 border rounded text-[15px] ${
                            filters.busTypes.includes("Xe thường")
                              ? "bg-[#EF5222] text-white"
                              : ""
                          }`}
                          onClick={() => handleBusTypeFilter("Xe thường")}
                        >
                          Thường
                        </button>
                        <button
                          className={`px-3 py-1 border rounded text-[15px] ${
                            filters.busTypes.includes("Limousine")
                              ? "bg-[#EF5222] text-white"
                              : ""
                          }`}
                          onClick={() => handleBusTypeFilter("Limousine")}
                        >
                          Limousine
                        </button>
                      </div>
                    </div>

                    <hr className="my-4 border-t border-gray-300" />

                    <div>
                      <p className="font-medium mb-2">Tầng</p>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className={`px-3 py-1 border rounded text-[15px] ${
                            filters.floors.includes("Tầng trên")
                              ? "bg-[#EF5222] text-white"
                              : ""
                          }`}
                          onClick={() => handleFloorFilter("Tầng trên")}
                        >
                          Tầng trên ({getTripCountByFloor("Tầng trên")})
                        </button>
                        <button
                          className={`px-3 py-1 border rounded text-[15px] ${
                            filters.floors.includes("Tầng dưới")
                              ? "bg-[#EF5222] text-white"
                              : ""
                          }`}
                          onClick={() => handleFloorFilter("Tầng dưới")}
                        >
                          Tầng dưới ({getTripCountByFloor("Tầng dưới")})
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-[800px] max-w-full">
                  <div className="bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-xl">
                        {routeTitle || "Vui lòng tìm kiếm chuyến xe"}
                      </h3>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                          <img
                            src="/images/save-money.png"
                            alt="Giá rẻ bất ngờ"
                            className="w-5 h-5 mr-[5px]"
                          />
                          Giá rẻ bất ngờ
                        </button>
                        <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                          <img
                            src="/images/time.png"
                            alt="Giờ khởi hành"
                            className="w-5 h-5 mr-[5px]"
                          />
                          Giờ khởi hành
                        </button>
                        <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                          <img
                            src="/images/car-seat.png"
                            alt="Ghế trống"
                            className="w-5 h-5 mr-[3px]"
                          />
                          Ghế trống
                        </button>
                      </div>
                    </div>

                    {tripType === "roundtrip" && (
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex w-full border-b border-gray-200">
                          <button
                            className={`flex-1 text-center py-3 ${
                              selectedTab === "departure"
                                ? "text-[#EF5222] border-b-[3px] border-[#EF5222]"
                                : "text-gray-800"
                            } uppercase text-base tracking-wide`}
                            onClick={() => setSelectedTab("departure")}
                          >
                            CHUYẾN ĐI -{" "}
                            {dayjs(departureDate)
                              .format("dddd, DD/MM")
                              .toUpperCase()}
                          </button>
                          <button
                            className={`flex-1 text-center py-3 ${
                              selectedTab === "return"
                                ? "text-[#EF5222] border-b-[3px] border-[#EF5222]"
                                : "text-gray-800"
                            } uppercase text-base tracking-wide`}
                            onClick={() => setSelectedTab("return")}
                          >
                            CHUYẾN VỀ -{" "}
                            {dayjs(returnDate)
                              .format("dddd, DD/MM")
                              .toUpperCase()}
                          </button>
                        </div>
                      </div>
                    )}

                    {filteredTrips.length === 0 ? (
                      <p className="text-center text-gray-500">
                        Không tìm thấy chuyến xe phù hợp.
                      </p>
                    ) : (
                      filteredTrips.map((trip) => (
                        <div
                          key={trip.id}
                          className="border border-gray-300 rounded-lg shadow-sm ring-1 ring-gray-100 px-5 py-4 mb-7"
                        >
                          <div className="flex justify-between items-start gap-6 mb-2">
                            <div className="flex items-center justify-between w-full gap-2">
                              <div className="flex flex-col items-start min-w-max">
                                <div className="flex items-center gap-2">
                                  <p className="text-2xl font-semibold">
                                    {new Date(
                                      trip.departureTime
                                    ).toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  <img
                                    src="/images/pickup.svg"
                                    alt="Điểm đón"
                                    className="w-5 h-5"
                                  />
                                  <div
                                    className="h-[2px] w-[80px] ml-2"
                                    style={{
                                      backgroundImage:
                                        "radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)",
                                      backgroundSize: "8px 2px",
                                      backgroundRepeat: "repeat-x",
                                    }}
                                  ></div>
                                </div>
                                <p className="text-gray-500 text-[16px] mt-1">
                                  {trip.busRoute.busStationFrom.name}
                                </p>
                              </div>

                              <div className="text-center min-w-max">
                                <p className="text-[15px] text-gray-500">
                                  {trip.busRoute.travelTime} giờ
                                </p>
                                <p className="text-sm text-gray-400">
                                  (Asia/Ho Chi Minh)
                                </p>
                              </div>

                              <div className="flex flex-col items-end min-w-max">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-[2px] w-[80px] mr-2"
                                    style={{
                                      backgroundImage:
                                        "radial-gradient(circle, #9CA3AF 1.5px, transparent 1.5px)",
                                      backgroundSize: "8px 2px",
                                      backgroundRepeat: "repeat-x",
                                    }}
                                  ></div>
                                  <img
                                    src="/images/station.svg"
                                    alt="Điểm đến"
                                    className="w-5 h-5"
                                  />
                                  <p className="text-2xl font-semibold ml-2">
                                    {calculateArrivalTime(
                                      trip.departureTime,
                                      trip.busRoute.travelTime
                                    )}
                                  </p>
                                </div>
                                <p className="text-gray-500 text-[16px] mt-1">
                                  {trip.busRoute.busStationTo.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end text-[16px] text-gray-600 mt-1 min-w-max">
                              <div className="flex gap-2 items-center">
                                <span className="text-xl leading-none">•</span>
                                <span>{trip.bus.busType.name}</span>
                                <span className="text-xl leading-none">•</span>
                                <span
                                  style={{ color: "#00613d" }}
                                  className="font-semibold"
                                >
                                  {trip.count} chỗ trống
                                </span>
                              </div>
                              <span className="text-red-500 font-semibold mt-1 text-[19px]">
                                {trip.price.toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          </div>

                          <hr className="my-4 border-t border-gray-300" />

                          <div className="flex justify-between items-center mt-4">
                            <div className="flex gap-4 text-[15px] text-gray-500 font-medium">
                              <span>Chọn ghế</span>
                              <span>Lịch trình</span>
                              <span>Trung chuyển</span>
                              <span>Chính sách</span>
                            </div>
                            <button
                              onClick={() => {
                                if (tripType === "oneway") {
                                  navigate(`/seat-selection/${trip.id}`, {
                                    state: { tripDetails: trip },
                                  });
                                } else {
                                  if (selectedTab === "departure") {
                                    setSelectedDepartureTrip(trip);
                                  } else {
                                    setSelectedReturnTrip(trip);
                                  }
                                }
                              }}
                              className="bg-orange-100 text-orange-500 px-4 py-1 rounded-full text-[15px] font-medium"
                            >
                              Chọn chuyến
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {!showSearchResults && (
          <>
            <section className="bg-white py-10">
              <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
                  FUTA BUS LINES – CHẤT LƯỢNG LÀ DANH DỰ
                </h2>
                <p className="text-center text-gray-600 mb-10">
                  Được khách hàng tin tưởng và lựa chọn
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <img
                      src="/images/icon-khach.png"
                      alt="Lượt khách"
                      className="w-20 h-20 mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#000]">
                      Hơn 40 Triệu
                    </h3>
                    <p className="font-semibold text-gray-700 mb-1">
                      Lượt khách
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phương Trang phục vụ hơn 40 triệu lượt khách bình quân 1
                      năm trên toàn quốc
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <img
                      src="/images/icon-phongve.png"
                      alt="Phòng vé"
                      className="w-20 h-20 mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#000]">Hơn 350</h3>
                    <p className="font-semibold text-gray-700 mb-1">
                      Phòng vé - Bưu cục
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến
                      xe,... trên toàn hệ thống
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <img
                      src="/images/icon-chuyenxe.png"
                      alt="Chuyến xe"
                      className="w-20 h-20 mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#000]">Hơn 6,500</h3>
                    <p className="font-semibold text-gray-700 mb-1">
                      Chuyến xe
                    </p>
                    <p className="text-gray-600 text-sm">
                      Phương Trang phục vụ hơn 6,500 chuyến xe đường dài và liên
                      tỉnh mỗi ngày
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#FFF7F5] py-10">
              <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
                  TUYẾN PHỔ BIẾN
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  Được khách hàng tin tưởng và lựa chọn
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <div className="relative h-40">
                      <img
                        src="/images/tphcm.png"
                        alt="Tuyến xe từ TP. Hồ Chí Minh"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-4 text-white">
                        <p className="text-sm">Tuyến xe từ</p>
                        <p className="text-lg font-semibold">Tp Hồ Chí Minh</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 text-[#00552E] font-medium">
                      <div className="flex justify-between">
                        <p>Đà Lạt</p>
                        <p className="text-black">290.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        305km - 8 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>Cần Thơ</p>
                        <p className="text-black">165.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        166km - 5 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>Long Xuyên</p>
                        <p className="text-black">200.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        203km - 5 giờ - 05/07/2025
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <div className="relative h-40">
                      <img
                        src="/images/dalat.png"
                        alt="Tuyến xe từ Đà Lạt"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-4 text-white">
                        <p className="text-sm">Tuyến xe từ</p>
                        <p className="text-lg font-semibold">Đà Lạt</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 text-[#00552E] font-medium">
                      <div className="flex justify-between">
                        <p>TP. Hồ Chí Minh</p>
                        <p className="text-black">290.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        310km - 8 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>Đà Nẵng</p>
                        <p className="text-black">430.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        757km - 17 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>Cần Thơ</p>
                        <p className="text-black">445.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        457km - 11 giờ - 05/07/2025
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <div className="relative h-40">
                      <img
                        src="/images/danang.png"
                        alt="Tuyến xe từ Đà Nẵng"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-4 text-white">
                        <p className="text-sm">Tuyến xe từ</p>
                        <p className="text-lg font-semibold">Đà Nẵng</p>
                      </div>
                    </div>
                    <div className="p-4 space-y-4 text-[#00552E] font-medium">
                      <div className="flex justify-between">
                        <p>Đà Lạt</p>
                        <p className="text-black">430.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        666km - 17 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>BX An Sương</p>
                        <p className="text-black">490.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        966km - 20 giờ - 05/07/2025
                      </p>

                      <div className="flex justify-between">
                        <p>Nha Trang</p>
                        <p className="text-black">370.000đ</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        528km - 9 giờ 25 phút - 05/07/2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white py-10">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-green-800 text-center mb-2">
                  KẾT NỐI FUTA GROUP
                </h2>
                <p className="text-gray-600 mb-8">
                  Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé
                  Xe Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng,...
                </p>

                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/icon-hopdong.png"
                        alt="Xe Hợp Đồng"
                        className="w-23 h-23"
                      />
                      <p className="mt-3 text-gray-700 font-medium">
                        Xe Hợp Đồng
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/icon-phuongtrang.png"
                        alt="Mua vé Phương Trang"
                        className="w-23 h-23"
                      />
                      <p className="mt-3 text-gray-700 font-medium">
                        Mua vé Phương Trang
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/icon-giaohang.png"
                        alt="Giao Hàng"
                        className="w-23 h-23"
                      />
                      <p className="mt-3 text-gray-700 font-medium">
                        Giao Hàng
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        src="/images/icon-xebuyt.png"
                        alt="Xe Buýt"
                        className="w-23 h-23"
                      />
                      <p className="mt-3 text-gray-700 font-medium">Xe Buýt</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <Snackbar
          open={snackBar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackBar}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity={snackBar.severity}
            sx={{ width: "100%" }}
          >
            {snackBar.message}
          </Alert>
        </Snackbar>
        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default HomePage;
