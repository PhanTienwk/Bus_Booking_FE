import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

import { Box, Card, CardContent, Snackbar, Alert } from "@mui/material";

import {
  getStatistics,
  getRevenueStatistics,
  getMonthlyRevenueStatistics,
  getCostSummary,
  getMonthlyFinance,
} from "../../services/StatisticService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { DatePicker, ConfigProvider, Button } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const AdminLayout = () => {
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStatistics();
        if (res.code === 1000) {
          setStats(res.result);
        } else {
          console.error("Lỗi lấy thống kê", res.message);
        }
      } catch (err) {
        console.error("Lỗi khi gọi API thống kê", err);
      }
    };

    fetchStats();
  }, []);

  const [stats, setStats] = useState({
    totalBus: 0,
    totalBusRoute: 0,
    totalBusTrip: 0,
    totalBusStation: 0,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenueStats, setRevenueStats] = useState({
    revenue: 0,
    cost: 0,
    profit: 0,
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);

  const [costSummary, setCostSummary] = useState({
    costOperating: 0,
    costIncurred: 0,
    totalCost: 0,
  });

  const [monthlyFinance, setMonthlyFinance] = useState([]);

  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const realRevenueData = {
    labels: monthlyRevenueData.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: monthlyRevenueData.map((item) => item.totalRevenue),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "📊 Doanh thu theo tháng",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return value.toLocaleString("vi-VN") + " đ";
          },
        },
      },
    },
  };

  const handleOpenSnackBar = (message, severity) => {
    setSnackBar({ open: true, message, severity });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackBar({ ...snackBar, open: false });
  };

  const handleFilterRevenue = async () => {
    if (!startDate || !endDate) {
      handleOpenSnackBar("Vui lòng chọn đầy đủ thời gian!", "error");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      handleOpenSnackBar("Khoảng thời gian không hợp lệ!", "error");
      return;
    }

    const fromDateTime = `${startDate}T00:00:00`;
    const toDateTime = `${endDate}T23:59:59`;

    try {
      const res = await getRevenueStatistics(fromDateTime, toDateTime);
      if (res.code === 1000) {
        setRevenueStats({
          revenue: res.result?.totalRevenue || 0,
          cost: res.result?.totalCost || 0,
          profit: res.result?.profit || 0,
        });
      }

      const monthlyRes = await getMonthlyRevenueStatistics(
        fromDateTime,
        toDateTime
      );
      if (monthlyRes.code === 1000) {
        setMonthlyRevenueData(monthlyRes.result);
      }

      const costRes = await getCostSummary(fromDateTime, toDateTime);
      if (costRes.code === 1000) {
        setCostSummary(costRes.result);
      }

      const monthlyFinanceRes = await getMonthlyFinance(
        fromDateTime,
        toDateTime
      );
      if (monthlyFinanceRes.code === 1000) {
        setMonthlyFinance(monthlyFinanceRes.result);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API doanh thu:", err);
    }
  };

  return (
    <div className="flex w-full">
      <div className="w-full max-w-screen-xl mx-auto pt-6 pb-2 px-6">
        <div className="mb-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              📊 Tổng quan hệ thống
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Số lượng xe",
                  value: stats.totalBus,
                  icon: "/images/bus.png",
                },
                {
                  label: "Số lượng tuyến xe",
                  value: stats.totalBusRoute,
                  icon: "/images/bus-route-bus.png",
                },
                {
                  label: "Số lượng chuyến xe",
                  value: stats.totalBusTrip,
                  icon: "/images/bus-route.png",
                },
                {
                  label: "Số lượng bến xe",
                  value: stats.totalBusStation,
                  icon: "/images/ticket.png",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white px-5 py-4 rounded shadow flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-600">{item.value}</p>
                  </div>
                  <img
                    src={item.icon}
                    alt={`icon ${item.label}`}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-wrap items-center gap-4">
              <ConfigProvider locale={viVN}>
                <label className="text-sm text-gray-700">Từ ngày:</label>
                <DatePicker
                  style={{ width: 200 }}
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(date) =>
                    setStartDate(date ? date.format("YYYY-MM-DD") : "")
                  }
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />

                <label className="text-sm text-gray-700">Đến ngày:</label>
                <DatePicker
                  style={{ width: 200 }}
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(date) =>
                    setEndDate(date ? date.format("YYYY-MM-DD") : "")
                  }
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </ConfigProvider>
              <Button
                type="primary"
                onClick={handleFilterRevenue}
                style={{ padding: "0 24px" }}
              >
                Lọc
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              💰 Tài chính
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  label: "Doanh thu",
                  value:
                    revenueStats.revenue != null
                      ? revenueStats.revenue.toLocaleString("vi-VN") + " đ"
                      : "0 đ",

                  icon: "/images/admin_image/money.png",
                },
                {
                  label: "Chi phí",
                  value:
                    revenueStats.cost != null
                      ? revenueStats.cost.toLocaleString("vi-VN") + " đ"
                      : "0 đ",
                  icon: "/images/budget.png",
                },
                {
                  label: "Lợi nhuận",
                  value:
                    revenueStats.profit != null
                      ? revenueStats.profit.toLocaleString("vi-VN") + " đ"
                      : "0 đ",
                  icon: "/images/financial-profit.png",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white px-5 py-4 rounded shadow flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-600">{item.value}</p>
                  </div>
                  <img
                    src={item.icon}
                    alt={`icon ${item.label}`}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-screen-xl mx-auto">
          <Box sx={{ padding: 0 }}>
            <Card>
              <CardContent>
                <Bar data={realRevenueData} options={revenueOptions} />
              </CardContent>
            </Card>
          </Box>

          <div className="bg-white mt-6 rounded shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">📋 Chi tiết chi phí</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Loại chi phí
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Tổng tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-6 py-3">Chi phí chuyến xe</td>
                    <td className="px-6 py-3">
                      {costSummary.costOperating.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-6 py-3">Chi phí phát sinh</td>
                    <td className="px-6 py-3">
                      {costSummary.costIncurred.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-6 py-3">Tổng cộng</td>
                    <td className="px-6 py-3">
                      {costSummary.totalCost.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white mt-6 rounded shadow mb-6">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                🧾 Bảng chi tiết chuyến đi và doanh thu từng chuyến
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Tháng/Năm
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Tổng chuyến
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Doanh thu
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Chi phí
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-600">
                      Lợi nhuận
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyFinance.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-6 py-3">{item.month}</td>
                      <td className="px-6 py-3">{item.totalTrips} chuyến</td>
                      <td className="px-6 py-3">
                        {item.revenue.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-6 py-3">
                        {item.cost.toLocaleString("vi-VN")} đ
                      </td>
                      <td className="px-6 py-3">
                        {item.profit.toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default AdminLayout;
