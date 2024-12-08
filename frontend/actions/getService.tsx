// getService.ts
import axios from "axios";
import { ExtraService } from "@/lib/types";

export const getServices = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services?populate=*`
    );
    return response.data.data as ExtraService[];
  } catch (error) {
    console.error("Error fetching extra services:", error);
    throw error;
  }
};
