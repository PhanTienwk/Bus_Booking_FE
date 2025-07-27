import React, { useState, useEffect } from "react";
import Select from "react-select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  handleGetAllProvince,
} from "../../services/BusStationService";
import {
  searchTripsByProvinces,
} from "../../services/HomeService";

const HomePage = () => {
  const [provinces, setProvinces] = useState([]);
  const [departure, setDeparture] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(""); // State mới cho ngày
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [trips, setTrips] = useState([]);
  const [routeTitle, setRouteTitle] = useState("");

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

  const handleSearch = async () => {
    if (!departure || !destination || !departureDate) {
      console.error("Vui lòng chọn điểm đi, điểm đến và ngày đi!");
      return;
    }

    try {
      const response = await searchTripsByProvinces(
        departure.value,
        destination.value,
        departureDate // Truyền ngày đã chọn vào API
      );
      setTrips(response.result); // Lưu danh sách chuyến xe từ API
      setShowSearchResults(true); // Hiển thị section kết quả tìm kiếm
      setRouteTitle(`${departure.label} - ${destination.label} (${response.result.length})`);
      console.log(response.result);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chuyến xe:", error);
      alert("Không tìm thấy chuyến xe. Vui lòng thử lại!");
    }
  };

  // Hàm tính giờ đến
  const calculateArrivalTime = (departureTime, travelTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(departure);
    const hours = Math.floor(travelTime);
    const minutes = Math.round((travelTime % 1) * 60); // Chuyển phần thập phân thành phút
    arrival.setHours(departure.getHours() + hours);
    arrival.setMinutes(departure.getMinutes() + minutes);
    return arrival.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    defaultChecked
                    className="accent-[#EF5222]"
                  />
                  Một chiều
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
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
              />
              <Select
                options={filteredDestinations}
                value={destination}
                onChange={setDestination}
                placeholder="Điểm đến"
                className="w-full"
                classNamePrefix="select"
                isSearchable
              />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)} // Cập nhật state ngày
                className="p-3 rounded-lg border w-full"
                aria-label="Chọn ngày đi"
                min={new Date().toISOString().split("T")[0]} // Giới hạn không chọn ngày quá khứ
              />
              <select className="p-3 rounded-lg border w-full">
                <option value="1">1 vé</option>
                <option value="2">2 vé</option>
                <option value="3">3 vé</option>
                <option value="4">4 vé</option>
                <option value="5">5 vé</option>
              </select>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3 bg-white rounded-xl shadow p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">BỘ LỌC TÌM KIẾM</h3>
                  <button className="flex items-center text-red-500 text-base font-medium">
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
                      <input type="checkbox" aria-label="Sáng sớm 00:00 - 06:00" />{" "}
                      <span className="ml-2 text-[15px]">
                        Sáng sớm 00:00 - 06:00 (0)
                      </span>
                    </li>
                    <li>
                      <input type="checkbox" aria-label="Buổi sáng 06:00 - 12:00" />{" "}
                      <span className="ml-2 text-[15px]">
                        Buổi sáng 06:00 - 12:00 (0)
                      </span>
                    </li>
                    <li>
                      <input type="checkbox" aria-label="Buổi chiều 12:00 - 18:00" />{" "}
                      <span className="ml-2 text-[15px]">
                        Buổi chiều 12:00 - 18:00 (3)
                      </span>
                    </li>
                    <li>
                      <input type="checkbox" aria-label="Buổi tối 18:00 - 24:00" />{" "}
                      <span className="ml-2 text-[15px]">
                        Buổi tối 18:00 - 24:00 (46)
                      </span>
                    </li>
                  </ul>
                </div>

                <hr className="my-4 border-t border-gray-300" />

                <div className="mb-4">
                  <p className="font-medium mb-2">Loại xe</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1 border rounded text-[15px]">
                      Thường
                    </button>
                    <button className="px-3 py-1 border rounded text-[15px]">
                      Limousine
                    </button>
                  </div>
                </div>

                <hr className="my-4 border-t border-gray-300" />

                <div>
                  <p className="font-medium mb-2">Tầng</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className="px-3 py-1 border rounded text-[15px]">
                      Tầng trên
                    </button>
                    <button className="px-3 py-1 border rounded text-[15px]">
                      Tầng dưới
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
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

                  {trips.length === 0 ? (
                    <p className="text-center text-gray-500">Không tìm thấy chuyến xe phù hợp.</p>
                  ) : (
                    trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="border border-gray-300 rounded-lg shadow-sm ring-1 ring-gray-100 px-5 py-4 mb-7"
                      >
                        <div className="flex justify-between items-start gap-6 mb-2">
                          <div className="flex items-center justify-between w-full gap-2">
                            <div className="flex flex-col items-start min-w-max">
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-semibold">
                                  {new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
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
                              <p className="text-[15px] text-gray-500">{trip.busRoute.travelTime} giờ</p>
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
                                  {calculateArrivalTime(trip.departureTime, trip.busRoute.travelTime)}
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
                                {trip.bus.busType.seatCount} chỗ trống
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
                          <button className="bg-orange-100 text-orange-500 px-4 py-1 rounded-full text-[15px] font-medium">
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
                  <h3 className="text-xl font-bold text-[#000]">Hơn 40 Triệu</h3>
                  <p className="font-semibold text-gray-700 mb-1">Lượt khách</p>
                  <p className="text-gray-600 text-sm">
                    Phương Trang phục vụ hơn 40 triệu lượt khách bình quân 1 năm
                    trên toàn quốc
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
                    Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,...
                    trên toàn hệ thống
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <img
                    src="/images/icon-chuyenxe.png"
                    alt="Chuyến xe"
                    className="w-20 h-20 mb-4"
                  />
                  <h3 className="text-xl font-bold text-[#000]">Hơn 6,500</h3>
                  <p className="font-semibold text-gray-700 mb-1">Chuyến xe</p>
                  <p className="text-gray-600 text-sm">
                    Phương Trang phục vụ hơn 6,500 chuyến xe đường dài và liên tỉnh
                    mỗi ngày
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
                Kết nối đa dạng hệ sinh thái FUTA Group qua App FUTA: mua vé Xe
                Phương Trang, Xe Buýt, Xe Hợp Đồng, Giao Hàng,...
              </p>

              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
                  <div className="flex flex-col items-center">
                    <img
                      src="/images/icon-hopdong.png"
                      alt="Xe Hợp Đồng"
                      className="w-23 h-23"
                    />
                    <p className="mt-3 text-gray-700 font-medium">Xe Hợp Đồng</p>
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
                    <p className="mt-3 text-gray-700 font-medium">Giao Hàng</p>
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

      <Footer />
    </div>
  );
};

export default HomePage;