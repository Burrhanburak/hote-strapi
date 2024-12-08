import axios from "axios";
import cookie from "js-cookie";

export const fetchCartItems = async (userId: number) => {
  try {
    const token = cookie.get("jwt");
    if (!token) throw new Error("JWT token not found");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/carts?filters[users_permissions_user][$eq]=${userId}&populate[extraServices]=*&populate[reservations]=*&populate[users_permissions_user]=*&populate=image`,
      config
    );

    return response.data.data || [];
  } catch (error: any) {
    console.error(
      "Error fetching cart items:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
