import axios from "../axios";
const handleGetTicketByUserId = (id) => {
  return axios.get(`/api/admin/get-ticket-by-idUser?id=${id}`);
};
const handleUpdateTicketStatus = (id, status) => {
  return axios.put(`/api/admin/update-ticket-status?id=${id}&status=${status}`);
};

export { handleGetTicketByUserId, handleUpdateTicketStatus };
