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

<<<<<<< HEAD
const handleFilterInvoices = (payload) => {
  return axios.post(`/api/filter`, payload);
};

const getTicketsByInvoiceId = async (invoiceId) => {
  try {
    const response = await axios.get(`/api/admin/get-invoice-by-id/${invoiceId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.code === 1000) {
      console.log(response.result)
      return {
        code: response.code,
        result: response.result || [],
      };
    } else {
      throw new Error(response.message || 'Lấy thông tin vé thất bại');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API getTicketsByInvoiceId:', error);
  }
};

const changeTicket = async (ticketId, newTripId) => {
  try {
    const response = await axios.put(`/tickets/${ticketId}/change`, {
      newTripId: newTripId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};




export { getAllInvoices, getAllInvoicesId, handleGetInvoiceByUserId, markInvoiceAsPaid,changeTicket, markInvoiceAsExpired,handleFilterInvoices,getTicketsByInvoiceId };
=======
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
>>>>>>> 013dfd4c1075a8e8b830e291d03e3557ec714368
