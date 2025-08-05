import axios from "../axios";
const handleGetTicketByPhone = (phone) => {
  return axios.get(`/api/admin/get-ticket-by-phone?phone=${phone}`);
};

export { handleGetTicketByPhone };
