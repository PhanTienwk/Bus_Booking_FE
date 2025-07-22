import axios from "../axios";

const getScheduleByDriverAndDateRange = (driverId, startDate, endDate) => {
  return axios.get(`/api/schedule/${driverId}`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};

export { 
  getScheduleByDriverAndDateRange,
 };
