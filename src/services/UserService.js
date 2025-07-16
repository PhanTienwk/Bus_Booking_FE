import axios from "../axios";

const getAllUsers = () => {
  return axios.get("/api/list-user");
};

const getAllDrivers = () => {
  return axios.get("/api/list-driver");
};

const updateUserById = (id, data) => {
  return axios.put(`/api/update-user/${id}`, data);
};

const deleteUserById = (id) => {
  return axios.delete(`/api/delete-user/${id}`);
};

const restoreUserById = (id) => {
  return axios.put(`/api/restore-user/${id}`);
};

const handleFilterUsers = (data) => {
  return axios.post("/api/filter-user", {
    name: data.name,
    gender: data.gender,
    birthday: data.birthday,
    phone: data.phone,
    email: data.email,
    status: data.status,
    roleId: 1,
  });
};

const handleFilterDrivers = (data) => {
  return axios.post("/api/filter-driver", {
    name: data.name,
    gender: data.gender,
    birthday: data.birthday,
    phone: data.phone,
    email: data.email,
    status: data.status,
    roleId: 2,
  });
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
  getAllDrivers,
  updateUserById,
  deleteUserById,
  restoreUserById,
  getAllInvoices,
  getAllBusRoutes,
  getAllBusTrips,
  getAllProvinces,
  handleFilterUsers,
  handleFilterDrivers
 };
