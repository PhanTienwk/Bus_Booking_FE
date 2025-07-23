import axios from "../axios";

const getScheduleByDriverAndDateRange = (driverId, startDate, endDate) => {
  return axios.get(`/api/schedule/${driverId}`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};

const getMyInfo = () => {
  return axios.get("/api/myinfo");
};
 
export { 
  getScheduleByDriverAndDateRange,
  getMyInfo,
 };
