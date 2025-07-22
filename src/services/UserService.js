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

const handleAddUser = (data) => {
  try {
    const response = axios.post("/api/create-user", data);
    return response;
  } catch (error) {
    throw new Error(error?.errorMessage ||
      error?.response?.data?.message ||
      error?.message || 'Thêm người dùng thất bại.');
  }
};

const handleAddDriver = async (data) => {
  try {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("name", data.name);
    if (data.avatar && data.avatar instanceof File) {
      formData.append("file", data.avatar);
    }
    formData.append("cccd", data.cccd);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("birthDate", data.birthDate); 
    formData.append("password", data.password);
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
       console.log(`${pair[0]}:`, pair[1]);
    }
    const response = await axios.post("/api/create-driver", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.log(error)
    throw new Error(
      error?.response?.data?.message || error?.message || "Thêm tài xế thất bại."
    );
  }
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
  handleFilterDrivers,
  handleAddUser,
  handleAddDriver
 };
