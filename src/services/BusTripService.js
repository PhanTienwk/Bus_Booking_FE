import axios from "../axios";

const handleGetAllUserApi = () => {
  return axios.get(`/api/get-all-userr`);
};

const handleGetAllBusTrip = () => {
  return axios.get(`/api/get-all-bustrip`);
};
const handleGetAllBusRoute = () => {
  return axios.get(`/api/get-all-busroutee`);
};

const handleUpdateBusTripStatus = (id, status) => {
  return axios.put(`/api/update-bus-trip-status`, null, {
    params: {
      id,
      status,
    },
  });
};

const handleAddBusTrip = (payload) => {
  return axios.post(`/api/add-bus-trip`, payload);
};

const handleUpdateBusTrip = (id, payload) => {
  return axios.put(`/api/update-bus-trip/${id}`, payload);
};

export {
  handleGetAllUserApi,
  handleGetAllBusTrip,
  handleGetAllBusRoute,
  handleUpdateBusTripStatus,
  handleAddBusTrip,
  handleUpdateBusTrip,
};
