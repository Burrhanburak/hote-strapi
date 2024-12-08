import axios from "axios";

export async function checkExistingReservations(
  userId: number,
  roomId: number,
  checkInDate: string,
  checkOutDate: string
) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reservations?filters[userId][$eq]=${userId}&filters[roomId][$eq]=${roomId}&filters[checkInDate][$gte]=${checkInDate}&filters[checkOutDate][$lte]=${checkOutDate}`
    );
    return response.data.data.length > 0;
  } catch (error) {
    console.error("Error checking existing reservations:", error);
    throw error;
  }
}

export async function makeReservation(
  userId: number | undefined,
  roomId: number,
  checkInDate: string,
  checkOutDate: string,
  adults: number
) {
  try {
    // Check for existing reservations
    const hasReservation = await checkExistingReservations(
      userId || -1,
      roomId,
      checkInDate,
      checkOutDate
    );
    if (hasReservation) {
      throw new Error("You already have a reservation for these dates.");
    }

    // Create reservation
    const reservationData = {
      userId: userId || null, // Store null for guest reservations
      roomId,
      checkInDate,
      checkOutDate,
      adults,
    };

    // Store reservation data temporarily for guest users
    if (!userId) {
      const existingReservations = JSON.parse(
        localStorage.getItem("guestReservations") || "[]"
      );
      localStorage.setItem(
        "guestReservations",
        JSON.stringify([...existingReservations, reservationData])
      );
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reservations`,
        reservationData
      );
    }
  } catch (error) {
    console.error("Failed to make reservation:", error);
    throw error;
  }
}
