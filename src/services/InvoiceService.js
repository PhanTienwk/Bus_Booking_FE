import axios from "../axios";

const getAllInvoices = () => {
  return axios.get("/api/admin/list-invoice");
};

const getAllInvoicesId = (id) => {
  return axios.get(`/api/admin/list-ticket/${id}`);
};

const handleGetInvoiceByUserId = (id) => {
  return axios.get(`/api/admin/get-invoice-by-userid?phone=${id}`);
};

const updateInvoiceStatus = (id) => {
  return axios.put(`/api/admin/update-invoice-status/${id}`);
};

export { getAllInvoices, getAllInvoicesId, handleGetInvoiceByUserId, updateInvoiceStatus };
