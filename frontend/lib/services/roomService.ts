import axios from "axios";
import { getStrapiURL } from "../utils";

interface Reservation {
  checkInDate: string;
  checkOutDate: string;
}

interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  reservations: Reservation[];
}

const baseUrl = getStrapiURL();

export const fetchRooms = async (
  checkIn: string,
  checkOut: string,
  adults: number,
  roomType?: string
): Promise<Room[]> => {
  const url = new URL("/api/rooms", baseUrl);

  // Adding search parameters to the URL
  url.searchParams.append("checkIn", checkIn);
  url.searchParams.append("checkOut", checkOut);
  url.searchParams.append("adults", adults.toString());
  if (roomType) {
    url.searchParams.append("roomType", roomType);
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const rooms: Room[] = await response.json();

    // Fetch reservations to exclude reserved rooms
    const reservationsResponse = await fetch("/api/reservations");
    if (!reservationsResponse.ok) {
      throw new Error(`Error: ${reservationsResponse.statusText}`);
    }
    const reservations: { roomId: number }[] =
      await reservationsResponse.json();

    // Filter rooms based on availability and other criteria
    const availableRooms = rooms.filter((room) => {
      const isReserved = reservations.some(
        (reservation) => reservation.roomId === room.id
      );
      return !isReserved && (!roomType || room.type === roomType);
    });

    return availableRooms;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
};

export const fetchRoomById = async (id: number): Promise<Room> => {
  const url = new URL(`/api/rooms/${id}`, baseUrl);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const room: Room = await response.json();
    return room;
  } catch (error) {
    console.error(`Failed to fetch room by ID (${id}):`, error);
    throw error;
  }
};

export const fetchRoomData = async (roomId: number) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}?populate=*`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching room data:", error);
    throw error;
  }
};
