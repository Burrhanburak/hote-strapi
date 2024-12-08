import { fetchRooms, fetchRoomById } from "../services/roomService";

export const getRooms = async (
  checkIn: string,
  checkOut: string,
  adults: number,
  roomType?: string
) => {
  try {
    return await fetchRooms(checkIn, checkOut, adults, roomType);
  } catch (error) {
    console.error("Failed to fetch rooms", error);
    throw error;
  }
};

export const getRoomById = async (id: number) => {
  try {
    return await fetchRoomById(id);
  } catch (error) {
    console.error("Failed to fetch room by ID", error);
    throw error;
  }
};
