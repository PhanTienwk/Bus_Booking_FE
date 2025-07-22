import axios from "../axios";

const getAllInvoices = () => {
  return axios.get("/api/admin/list-invoice");
};

const getAllInvoicesId = (id) => {
  return axios.get(`/api/admin/list-ticket/${id}`);
};

export { 
  getAllInvoices,
  getAllInvoicesId,
 };
