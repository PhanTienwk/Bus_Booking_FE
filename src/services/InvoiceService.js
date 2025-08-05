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

const handleUpdateInvoiceStatus = (id, status) => {
  return axios.put(
    `/api/admin/update-invoice-status?id=${id}&status=${status}`
  );
};

const handleAddBankDT = (data) => {
  return axios.post("/api/admin/add-bank-detail", {
    idUser: data.idUser,
    idInvoice: data.idInvoice,
    bankName: data.bankName,
    bankAccount: data.bankAccountNumber,
  });
};

const markInvoiceAsPaid = (id) => {
  return axios.put(`/api/admin/mark-invoice-paid/${id}`);
};

const markInvoiceAsExpired = (invoiceId, selectedSeats, busId) => {
  return axios.put("/api/admin/mark-invoice-expired", {
    invoiceId,
    selectedSeats,
    busId,
  });
};

const handleGetBankList = (id) => {
  return axios.get(`/https://api.vietqr.io/v2/banks`);
};

export {
  handleGetBankList,
  handleAddBankDT,
  getAllInvoices,
  getAllInvoicesId,
  handleGetInvoiceByUserId,
  handleUpdateInvoiceStatus,
  markInvoiceAsPaid,
  markInvoiceAsExpired,
};
