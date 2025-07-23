import axios from "../axios";

const handleAddProvince = (data) => {
  return axios.post("/api/add-province", {
    name: data.nameAdd,
    status: data.statusAdd ? 1 : 0,
  });
};

const handleUpdateProvince = (id, data) => {
  return axios.put(`/api/update-province/${id}`, {
    name: data.name,
    status: data.status,
  });
};

const handleUpdateProvinceStatus = (id, status) => {
  return axios.put(`/api/update-province-status/${id}?status=${status}`);
};
const handleFilterProvinces = (data) => {
  return axios.post("/api/filter", {
    id: data.id,
    name: data.name,
    status: data.status,
  });
};

export {
  handleAddProvince,
  handleUpdateProvince,
  handleUpdateProvinceStatus,
  handleFilterProvinces,
};
