import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const {
    tripDetails,
    selectedSeats,
    returnTrip,
    selectedSeatsReturn,
  } = location.state || {};

  const navigate = useNavigate();

  return (
    <div>
      <Header />

      <section className="bg-[#f7f7f7] py-10 px-4 flex items-center justify-center">
        <div className="w-full max-w-full sm:max-w-[95%] lg:max-w-[77%] mx-auto rounded-xl border-[8px] border-[#AA2E081A] shadow-sm">
          <div className="rounded-[0.4rem] border border-[#EF5222] bg-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/images/success.png"
                alt="Success"
                className="w-24 h-24"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Đặt vé thành công
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="min-w-full text-sm text-center border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border">Thời gian</th>
                    <th className="py-2 px-4 border">Chuyến xe</th>
                    <th className="py-2 px-4 border">Số lượng ghế</th>
                    <th className="py-2 px-4 border">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800">
                    <td className="py-2 px-4 border">
                      {tripDetails?.departureTime
                        ? new Date(tripDetails.departureTime).toLocaleString(
                            "vi-VN"
                          )
                        : ""}
                    </td>
                    <td className="py-2 px-4 border">
                      {tripDetails.busRoute.busStationFrom.name} -{" "}
                      {tripDetails.busRoute.busStationTo.name}
                    </td>
                    <td className="py-2 px-4 border">
                      {selectedSeats?.length || 0} Ghế
                    </td>
                    <td className="py-2 px-4 border font-semibold">
                      {(
                          tripDetails.price * selectedSeats.length
                        ).toLocaleString("vi-VN")}
                        đ
                    </td>
                  </tr>
                  {returnTrip && (
                    <tr className="text-gray-800">
                      <td className="py-2 px-4 border">
                        {new Date(returnTrip.departureTime).toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="py-2 px-4 border">
                        {returnTrip.busRoute.busStationFrom.name} -{" "}
                        {returnTrip.busRoute.busStationTo.name}
                      </td>
                      <td className="py-2 px-4 border">
                        {selectedSeatsReturn?.length || 0} Ghế
                      </td>
                      <td className="py-2 px-4 border font-semibold">
                        {(
                          returnTrip.price * selectedSeatsReturn.length
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-gray-700 mb-2">
              Cảm ơn bạn đã tin tưởng sử dụng dịch vụ chúng tôi
            </p>
            <p className="text-sm text-orange-500 font-semibold mb-6">
              Mọi thắc mắc xin vui lòng liên hệ số điện thoại sau:
              <span className="text-[#f5a623]"> 090-080-070</span>
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-10">
              <button
                className="border border-orange-500 text-orange-500 px-6 py-2 rounded-full font-medium hover:bg-orange-50 transition"
                onClick={() => navigate("/user")}
              >
                QUAY LẠI TRANG CHỦ
              </button>
              <button className="bg-[#ef5222] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition">
                ĐƠN HÀNG CỦA TÔI
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYouPage;
