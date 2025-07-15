import axios from "../axios";

const handleGetAllBusApi = (id) => {
  return axios.get(`/api/get-all-bus`);
};

const handleGetAllBusTypeApi = (id) => {
  return axios.get(`/api/get-all-bus-type`);
};

const handleAddBus = (payload) => {
  return axios.post(`/api/add-bus`, payload);
};

const handleUpdateBus = (id, data) => {
  return axios.put(`/api/update-bus/${id}`, data);
};

const handleUpdateBusStatus = (id, status) => {
  return axios.put(`/api/update-bus-status/${id}`, null, {
    params: { status },
  });
};

const handleFilterBuses = (filterData) => {
  return axios.post(`/api/filter-buses`, filterData);
};

export {
  handleGetAllBusApi,
  handleGetAllBusTypeApi,
  handleAddBus,
  handleUpdateBus,
  handleUpdateBusStatus,
  handleFilterBuses,
};
