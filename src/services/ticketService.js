import axios from "../axios";
const handleGetTicketByUserId = (id) => {
  return axios.get(`/api/admin/get-ticket-by-idUser?id=${id}`);
};

export { handleGetTicketByUserId };
