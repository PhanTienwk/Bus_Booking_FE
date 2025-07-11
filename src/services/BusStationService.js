import axios from "../axios";

const handleGetAllBusStation = () => {
  return axios.get(`/api/bus-station`);
};

export { handleGetAllBusStation };
