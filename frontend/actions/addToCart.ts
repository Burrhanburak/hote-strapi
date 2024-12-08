import axios from "axios";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import cookie from "js-cookie";

export const addToCart = async (
  roomId: number,
  quantity: number,
  amount: number,

  extraServices: number[],
  image: string,
  reservationId: number
) => {
  try {
    const token = cookie.get("jwt");
    const userResponse = await getUserMeLoader();
    if (!userResponse.ok || !userResponse.data) {
      throw new Error("User is not authenticated");
    }

    const userId = userResponse.data.id;

    const response = await axios.post(
      "http://localhost:1337/api/carts",
      {
        data: {
          quantity,
          amount,
          extraServices,
          image,
          reservations: reservationId, // Ensure this field name matches the backend
          users_permissions_user: userId,

          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${cookie.get("jwt")}`,
        },
      }
    );

    if (response.data.error) {
      console.error("API Error Details:", response.data.error);
      throw new Error(
        response.data.error.message || "Failed to add room to cart"
      );
    }

    return response.data;
  } catch (error: any) {
    console.error("API Error Details:", error.response?.data || error.message);
    throw new Error(`Error adding room to cart: ${error.message}`);
  }
};
