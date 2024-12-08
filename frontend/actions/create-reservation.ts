import axios from "axios";

export const createReservation = async (payload: any, token: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reservations`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error.message || "Room reservation failed");
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};
