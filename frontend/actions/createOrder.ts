import axios from "axios";

export const createOrder = async (payload: any, jwt: string) => {
  try {
    const response = await axios.post(
      "http://localhost:1337/api/orders",
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to create order");
    }
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
