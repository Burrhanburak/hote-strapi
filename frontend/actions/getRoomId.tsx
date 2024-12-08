import { Room } from "@/lib/types";
import axios from "axios";

export const getRoomById = async ({
  params,
}: {
  params: { id: string };
}): Promise<Room> => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:1337/api";

  const url = `${baseUrl}/rooms/${params.id}?populate=*`;

  try {
    const res = await axios.get(url);
    const data = res.data.data;

    if (!data) {
      throw new Error("Room not found");
    }

    return data as Room;
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};
