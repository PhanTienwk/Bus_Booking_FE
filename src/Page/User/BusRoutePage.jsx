import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const BusRoutePage = () => {
  return (
    <div>
      <Header />

      <section className="bg-white">
        <div className="max-w-6xl mx-auto">
          <img
            src="/images/home_background.png"
            alt="Banner"
            className="rounded-xl shadow-lg mt-6 w-full"
          />
        </div>
      </section>

      <section className="bg-white relative">
        <div className="max-w-6xl mx-auto mt-6 mb-10 rounded-xl border-[8px] border-[#AA2E081A] shadow-sm">
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
              <input
                type="text"
                placeholder="Điểm đi"
                className="p-3 rounded-lg border w-full"
              />
              <input
                type="text"
                placeholder="Điểm đến"
                className="p-3 rounded-lg border w-full"
              />
              <input type="date" className="p-3 rounded-lg border w-full" />
              <select className="p-3 rounded-lg border w-full">
                <option value="1">1 vé</option>
                <option value="2">2 vé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[40%] z-10">
          <button className="bg-[#EF5222] text-white px-[77px] py-3 rounded-full font-semibold hover:brightness-105 shadow-lg">
            Tìm chuyến xe
          </button>
        </div>
      </section>

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
                    alt="Xóa"
                    className="w-5 h-5 ml-1"
                  />
                </button>
              </div>

              <div className="mb-4">
                <p className="font-medium mb-2">Giờ đi</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <input type="checkbox" />{" "}
                    <span className="ml-2 text-[15px]">
                      Sáng sớm 00:00 - 06:00 (0)
                    </span>
                  </li>
                  <li>
                    <input type="checkbox" />{" "}
                    <span className="ml-2 text-[15px]">
                      Buổi sáng 06:00 - 12:00 (0)
                    </span>
                  </li>
                  <li>
                    <input type="checkbox" />{" "}
                    <span className="ml-2 text-[15px]">
                      Buổi chiều 12:00 - 18:00 (3)
                    </span>
                  </li>
                  <li>
                    <input type="checkbox" />{" "}
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

              <div className="mb-4">
                <p className="font-medium mb-2">Hàng ghế</p>
                <div className="flex gap-2 flex-wrap">
                  <button className="px-3 py-1 border rounded text-[15px]">
                    Hàng đầu
                  </button>
                  <button className="px-3 py-1 border rounded text-[15px]">
                    Hàng giữa
                  </button>
                  <button className="px-3 py-1 border rounded text-[15px]">
                    Hàng cuối
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

            <hr className="my-4 border-t border-gray-300" />

            <div className="w-full md:w-2/3">
              <div className="bg-white">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-xl">
                    TP. Hồ Chí Minh - Đà Lạt (49)
                  </h3>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                      <img
                        src="/images/save-money.png"
                        alt="Tag"
                        className="w-5 h-5 mr-[5px]"
                      />
                      Giá rẻ bất ngờ
                    </button>
                    <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                      <img
                        src="/images/time.png"
                        alt="Clock"
                        className="w-5 h-5 mr-[5px] text-[#EF5222]"
                      />
                      Giờ khởi hành
                    </button>
                    <button className="flex items-center gap-1 bg-[#fef6f3] border border-orange-300 text-[#EF5222] rounded px-2 py-1 text-base">
                      <img
                        src="/images/car-seat.png"
                        alt="Seat"
                        className="w-5 h-5 mr-[3px]"
                      />
                      Ghế trống
                    </button>
                  </div>
                </div>

                <div className="border border-gray-300 rounded-lg shadow-sm ring-1 ring-gray-100 px-5 py-4 mb-7">
                  <div className="flex justify-between items-start gap-6 mb-2">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex flex-col items-start min-w-max">
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-semibold">17:00</p>
                          <img
                            src="/images/pickup.svg"
                            alt="Pickup"
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
                          Bến Xe Miền Tây
                        </p>
                      </div>

                      <div className="text-center min-w-max">
                        <p className="text-[15px] text-gray-500">8 giờ</p>
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
                            alt="Station"
                            className="w-5 h-5"
                          />
                          <p className="text-2xl font-semibold ml-2">01:00</p>
                        </div>
                        <p className="text-gray-500 text-[16px] mt-1">
                          Bến Xe Đà Lạt
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-[16px] text-gray-600 mt-1 min-w-max">
                      <div className="flex gap-2 items-center">
                        <span className="text-xl leading-none">•</span>
                        <span>Limousine</span>
                        <span className="text-xl leading-none">•</span>
                        <span
                          style={{ color: "#00613d" }}
                          className="font-semibold"
                        >
                          18 chỗ trống
                        </span>
                      </div>
                      <span className="text-red-500 font-semibold mt-1 text-[19px]">
                        290.000đ
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

                <div className="border border-gray-300 rounded-lg shadow-sm ring-1 ring-gray-100 px-5 py-4 mb-7">
                  <div className="flex justify-between items-start gap-6 mb-2">
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex flex-col items-start min-w-max">
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-semibold">17:00</p>
                          <img
                            src="/images/pickup.svg"
                            alt="Pickup"
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
                          Bến Xe Miền Tây
                        </p>
                      </div>

                      <div className="text-center min-w-max">
                        <p className="text-[15px] text-gray-500">8 giờ</p>
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
                            alt="Station"
                            className="w-5 h-5"
                          />
                          <p className="text-2xl font-semibold ml-2">01:00</p>
                        </div>
                        <p className="text-gray-500 text-[16px] mt-1">
                          Bến Xe Đà Lạt
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-[16px] text-gray-600 mt-1 min-w-max">
                      <div className="flex gap-2 items-center">
                        <span className="text-xl leading-none">•</span>
                        <span>Limousine</span>
                        <span className="text-xl leading-none">•</span>
                        <span
                          style={{ color: "#00613d" }}
                          className="font-semibold"
                        >
                          18 chỗ trống
                        </span>
                      </div>
                      <span className="text-red-500 font-semibold mt-1 text-[19px]">
                        290.000đ
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusRoutePage;
