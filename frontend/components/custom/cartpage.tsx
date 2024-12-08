"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import cookie from "js-cookie";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";

interface Room {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    room_number: number;
    image: {
      data: any;
      id: number;
      attributes: {
        name: string;
        url: string;
      };
    };
    price: number;
    availability: boolean;
    type: string;
    service?: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      }[];
    };
  };
}

export type Service = {
  id: number;
  attributes: {
    name: string;
    price: number;
  };
};

export type CartItem = {
  id: number;
  attributes: {
    amount: number;
    quantity: number;
    roomId: number;
    extraServices?: number[];
    image: string;
  };
};

interface CartPageProps {
  user: any;
}

const CartPage = ({ user }: CartPageProps) => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [rooms, setRooms] = useState<Record<number, Room>>({});
  const [services, setServices] = useState<Record<number, Service>>({});
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndCartData = async () => {
      try {
        const token = cookie.get("jwt");
        const userResponse = await getUserMeLoader();
        const user = userResponse.data;

        if (!user) {
          throw new Error("User not found");
        }
        if (!token) throw new Error("JWT token not found");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch cart items
        const cartResponse = await axios.get(
          "http://localhost:1337/api/carts",
          config
        );
        const items = cartResponse.data.data || [];
        setCartItems(items);

        // Fetch room details
        const roomIds = [
          ...new Set(items.map((item: CartItem) => item.attributes.roomId)),
        ];
        const roomRequests = roomIds.map((id) =>
          axios.get(`http://localhost:1337/api/rooms/${id}`, config)
        );
        const roomResponses = await Promise.all(roomRequests);
        const roomData = roomResponses.reduce((acc, response) => {
          const room = response.data.data;
          acc[room.id] = room;
          return acc;
        }, {} as Record<number, Room>);
        setRooms(roomData);

        // Fetch service details
        const serviceIds = [
          ...new Set(
            items.flatMap((item) => item.attributes.extraServices || [])
          ),
        ];
        const serviceRequests = serviceIds.map((id) =>
          axios.get(`http://localhost:1337/api/services/${id}`, config)
        );
        const serviceResponses = await Promise.all(serviceRequests);
        const serviceData = serviceResponses.reduce((acc, response) => {
          const service = response.data.data;
          acc[service.id] = service;
          return acc;
        }, {} as Record<number, Service>);
        setServices(serviceData);

        // Calculate total price
        const totalAmount = items.reduce((sum, item) => {
          const room = roomData[item.attributes.roomId];
          if (!room) return sum;
          const itemTotal =
            (item.attributes.amount || 0) * (item.attributes.quantity || 0);
          const servicesTotal = (item.attributes.extraServices || []).reduce(
            (serviceSum, serviceId) => {
              const service = serviceData[serviceId];
              return serviceSum + (service?.attributes.price || 0);
            },
            0
          );
          return sum + itemTotal + servicesTotal;
        }, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error(
          "Error fetching cart data, room details, or services:",
          error.response?.data || error.message
        );
        setError("Failed to fetch cart data. Please try again.");
      }
    };

    fetchUserAndCartData();
  }, []);

  const removeItem = async (itemId: number) => {
    try {
      const token = cookie.get("jwt");
      if (!token) throw new Error("JWT token not found");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:1337/api/carts/${itemId}`, config);
      const cartResponse = await axios.get(
        "http://localhost:1337/api/carts",
        config
      );
      const updatedItems = cartResponse.data.data || [];
      setCartItems(updatedItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const proceedToCheckout = () => {
    const token = cookie.get("jwt");
    if (!token) {
      router.push("/api/auth/local");
      return;
    } else {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("total", JSON.stringify(total));
      router.push("/checkout");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {error && <p className="text-red-500">{error}</p>}
      {cartItems.map((item) => {
        const imageUrl = item.attributes.image || "";

        return (
          <div key={item.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Room {item.attributes.roomId}
            </h2>
            <div className="relative w-32 h-32 mb-2">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Room Image"
                  width={200}
                  height={150}
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-gray-700 mb-2">
              Price: ${item.attributes.amount}
            </p>
            <p className="text-gray-700 mb-2">
              Quantity: {item.attributes.quantity}
            </p>
            <p className="text-gray-700 mb-2">
              Total: ${item.attributes.amount * item.attributes.quantity}
            </p>
            {item.attributes.extraServices &&
              item.attributes.extraServices.length > 0 && (
                <div className="mb-2">
                  <h3 className="font-semibold">Extra Services:</h3>
                  <ul>
                    {item.attributes.extraServices.map((serviceId) => {
                      const service = services[serviceId];
                      return (
                        <li key={serviceId}>
                          {service?.attributes.name} - $
                          {service?.attributes.price}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            <button
              onClick={() => removeItem(item.id)}
              className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        );
      })}
      <h2 className="text-xl font-bold mt-4">Total: ${total}</h2>

      <button
        onClick={proceedToCheckout}
        className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartPage;
