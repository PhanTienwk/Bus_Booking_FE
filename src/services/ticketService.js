import axios from "../axios";
const handleGetTicketByUserId = (id) => {
  return axios.get(`/api/admin/get-ticket-by-idUser?id=${id}`);
};
const handleUpdateTicketStatus = (id, status) => {
  return axios.put(`/api/admin/update-ticket-status?id=${id}&status=${status}`);
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

export { handleGetTicketByUserId, handleUpdateTicketStatus,consultTicket };
