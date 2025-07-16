import axios from "../axios";

const getAllUsers = () => {
  return axios.get("/api/admin/list-user");
};

const updateUserById = (id, data) => {
  return axios.put(`/api/admin/update-user/${id}`, data);
};

const deleteUserById = (id) => {
  return axios.delete(`/api/admin/delete-user/${id}`);
};

const getAllInvoices = () => {
  return axios.get("/api/admin/list-invoice");
};

const getAllBusRoutes = () => {
  return axios.get("/api/admin/list-bus-route");
};


const getAllBusTrips = () => {
  return axios.get("/api/admin/list-bus-trip");
};

const getAllProvinces = () => {
  return axios.get("/api/admin/list-province");
};

export { 
  getAllUsers,
  updateUserById,
  deleteUserById,
  getAllInvoices,
  getAllBusRoutes,
  getAllBusTrips,
  getAllProvinces
 };
