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