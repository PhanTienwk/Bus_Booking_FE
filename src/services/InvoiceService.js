import axios from "../axios";

const getAllInvoices = () => {
  return axios.get("/api/admin/list-invoice");
};

const getAllInvoicesId = (id) => {
  return axios.get(`/api/admin/list-ticket/${id}`);
};

const handleGetInvoiceByUserId = (id) => {
  return axios.get(`/api/admin/get-invoice-by-userid?id=${id}`);
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

const handleFilterInvoices = (payload) => {
  return axios.post(`/api/filter`, payload);
};

const getTicketsByInvoiceId = async (invoiceId) => {
  try {
    const response = await axios.get(
      `/api/admin/get-invoice-by-id/${invoiceId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.code === 1000) {
      console.log(response.result);
      return {
        code: response.code,
        result: response.result || [],
      };
    } else {
      throw new Error(response.message || "Lấy thông tin vé thất bại");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getTicketsByInvoiceId:", error);
  }
};

const changeTicket = async (ticketId, busTripId, seatPositions, price) => {
  try {
    const response = await axios.put(`/api/tickets/${ticketId}/change`, {
      ticketId,
      busTripId,
      seatPosition: seatPositions[0], 
      price,
    });
    return response;
  } catch (error) {
    throw error.response?.code || { message: "Lỗi khi đổi vé!" };
  }
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
  changeTicket,
  getTicketsByInvoiceId,
  handleFilterInvoices,
};
