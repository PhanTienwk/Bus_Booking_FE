import axios from "../axios";


export const fetchSeatLayout = async (busId) => {
  try {
    const response = await axios.get(`/api/seats/bus/${busId}`);
    const seats = response.result;

    const upperSeats = seats.filter((seat) => seat.name.startsWith("A")).map((seat) => seat.name);
    const lowerSeats = seats.filter((seat) => seat.name.startsWith("B")).map((seat) => seat.name);
    const bookedSeats = seats.filter((seat) => seat.status === false).map((seat) => seat.name);
    return { upperSeats, lowerSeats, bookedSeats };
  } catch (error) {
    console.error("Lỗi khi lấy sơ đồ ghế:", error);
  }
};

export const handleSeatSelection = (seat, selectedSeats, setSelectedSeats) => {
  if (selectedSeats.includes(seat)) {
    setSelectedSeats(selectedSeats.filter((s) => s !== seat));
  } else {
    setSelectedSeats([...selectedSeats, seat]);
  }
};

export const createInvoice = async (invoiceData) => {
  console.log(invoiceData.listidseatposition)
  console.log(invoiceData.idbustrip)
  try {
    return axios.post("/api/admin/create-invoice", {
    id: invoiceData.id,
    email: invoiceData.email,
    name: invoiceData.name,
    phone: invoiceData.phone,
    number_of_tickets: invoiceData.number_of_tickets,
    payment_method: invoiceData.payment_method,
    listidseatposition: invoiceData.listidseatposition,
    idbustrip: invoiceData.idbustrip,
    });
  } catch (error) {
    throw error;
  }
};