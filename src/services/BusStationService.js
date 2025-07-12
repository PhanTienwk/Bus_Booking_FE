import axios from "../axios";

const handleGetAllBusStation = () => {
  return axios.get(`/api/bus-station`);
};

const handleGetAllProvince = () => {
  return axios.get(`/api/get-all-province`);
};

const handleUpdateBusStation = (data) => {
  return axios.put("/api/update-bus-station", data);
};

const handleAddBusStation = (data) => {
  return axios.post("/api/add-new-bus-station", {
    provinceIdAdd: data.provinceIdAdd,
    nameAdd: data.nameAdd,
    addressAdd: data.addressAdd,
    phoneAdd: data.phoneAdd,
    statusAdd: data.statusAdd,
  });
};

const handleFilterBusStations = (data) => {
  return axios.post("/api/filter-bus-station", {
    id: data.id,
    name: data.name,
    address: data.address,
    phone: data.phone,
    provinceId: data.provinceId,
    status: data.status,
  });
};
export {
  handleGetAllBusStation,
  handleGetAllProvince,
  handleUpdateBusStation,
  handleAddBusStation,
  handleFilterBusStations,
};
