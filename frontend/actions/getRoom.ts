import { Room } from "@/lib/types";
import axios from "axios";

const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rooms`;

const url = "http://localhost:1337/api/rooms?populate=*";

export const getRoom = async (): Promise<Room[]> => {
  const res = await axios.get(url);
  const data = res.data.data;
  return data;
};
