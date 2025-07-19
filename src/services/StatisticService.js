import axios from "../axios";

const getStatistics = () => {
  return axios.get("/api/dashboard");
};

const getRevenueStatistics = async (startDate, endDate) => {
  return await axios.post("/api/dashboard/revenue", {
    fromDate: startDate,
    toDate: endDate,
  });
};

const getMonthlyRevenueStatistics = async (startDate, endDate) => {
  return await axios.post("/api/dashboard/monthly-revenue", {
    fromDate: startDate,
    toDate: endDate,
  });
};

const getCostSummary = async (startDate, endDate) => {
  return await axios.post("/api/dashboard/cost-summary", {
    fromDate: startDate,
    toDate: endDate,
  });
};

const getMonthlyFinance = async (startDate, endDate) => {
  return await axios.post("/api/dashboard/monthly-finance", {
    fromDate: startDate,
    toDate: endDate,
  });
};

export { 
  getStatistics,
  getRevenueStatistics,
  getMonthlyRevenueStatistics,
  getCostSummary,
  getMonthlyFinance
 };
