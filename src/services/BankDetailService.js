import axios from "../axios";

const handleGetAllBank = () => {
  return axios.get(`/api/admin/get-all-bank`);
};

export { handleGetAllBank };
