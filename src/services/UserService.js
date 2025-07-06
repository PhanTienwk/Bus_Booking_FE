import axios from "../axios";

const handleGetAllUserApi = (id) => {
  return axios.get(`/get-all-user`);
};

export { handleGetAllUserApi };
