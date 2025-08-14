import axios from "../axios";
const handleGetTicketByUserId = (id) => {
  return axios.get(`/api/admin/get-ticket-by-idUser?id=${id}`);
};
const handleUpdateTicketStatus = (id, status) => {
  return axios.put(`/api/admin/update-ticket-status?id=${id}&status=${status}`);
};

const consultTicket = async (ticketId, phone) => {
  try {
    const response = await axios.post("/api/consultTicket", {
      ticketId,
      phone,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.message || "Không thể kết nối đến server. Vui lòng thử lại sau!"
    );
  }
};

export { handleGetTicketByUserId, handleUpdateTicketStatus,consultTicket };
