import { getStrapiURL } from "../utils";
import { getAuthToken } from "./get-token";
import { getUserMeLoader } from "./get-user-me-loader";

interface Reservation {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  user: {
    id: number;
  };
  room: {
    id: number;
  };
}

const baseUrl = getStrapiURL();

export const createReservation = async (
  userId: number,
  roomId: number,
  checkInDate: string,
  checkOutDate: string,
  adults: number
): Promise<Reservation> => {
  const url = new URL("/api/reservations", baseUrl);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify({
        user: userId,
        room: roomId,
        checkInDate,
        checkOutDate,
        adults,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const reservation: Reservation = await response.json();
    return reservation;
  } catch (error) {
    console.error("Failed to create reservation:", error);
    throw error;
  }
};

export const fetchReservations = async (
  roomId: number
): Promise<Reservation[]> => {
  const url = new URL(`/rooms/${roomId}/reservations`, baseUrl);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const reservations: Reservation[] = await response.json();
    return reservations;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    throw error;
  }
};

// Serverless function handler for creating and fetching reservations
export const reservationHandler = async (req, res) => {
  const user = await getUserMeLoader();
  console.log(user);

  if (req.method === "POST") {
    const { roomId, checkInDate, checkOutDate, adults } = req.body;
    const userId = user?.id;

    try {
      const newReservation = await createReservation(
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        adults
      );
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const roomId = req.query.roomId;
      const reservations = await fetchReservations(roomId);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
