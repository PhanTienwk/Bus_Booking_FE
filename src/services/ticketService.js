import axios from "../axios";
const handleGetTicketByUserId = (id) => {
  return axios.get(`/api/admin/get-ticket-by-idUser?id=${id}`);
};
const handleUpdateTicketStatus = (id, status) => {
  return axios.put(`/api/admin/update-ticket-status?id=${id}&status=${status}`);
};


const handleGetAllTicket = () => {
  return axios.get(`/api/admin/list-ticket`);
};
const handleFilterTickets = (filterData) => {
  return axios.post("/api/admin/filter-ticket-cancel", {
    name: filterData.name || "",
    phone: filterData.phone || "",
    email: filterData.email || "",
    status: filterData.status || "",
    seatName: filterData.seatName || "",
    bankAccountNumber: filterData.bankAccountNumber || "",
  });
};

const consultTicket = async (ticketId, phone) => {
  try {
    const response = await axios.post("/api/admin/consultTicket", {
      ticketId,
      phone,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.errorMessage  || "Tra cứu vé thất bại!"
    );
  }
};
export {
  handleFilterTickets,
  handleGetTicketByUserId,
  handleUpdateTicketStatus,
  handleGetAllTicket,
  consultTicket
};




