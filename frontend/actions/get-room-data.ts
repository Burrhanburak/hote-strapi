import axios from "axios";

export const getRoomData = async (roomId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:1337/api/rooms/${roomId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};
