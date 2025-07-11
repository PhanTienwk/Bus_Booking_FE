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


export { 
  getAllUsers,
  updateUserById,
  deleteUserById
 };
