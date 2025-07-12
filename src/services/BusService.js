import axios from "../axios";

const handleGetAllBusApi = (id) => {
  return axios.get(`/api/get-all-bus`);
};

const handleGetAllBusTypeApi = (id) => {
  return axios.get(`/api/get-all-bus-type`);
};

export { handleGetAllBusApi, handleGetAllBusTypeApi };
