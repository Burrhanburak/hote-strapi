"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import cookie from "js-cookie";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import { fetchCartItems } from "@/actions/fetchCartItems";
import { DeleteToCart } from "@/actions/deleteToCart";

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
      data: {
        attributes: {
          url: string;
        };
      };
    };
    price: number;
    availability: boolean;
    type: string;
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
    extraServices?: number[];
    image: string;
    reservations: {
      data: {
        id: number;
        attributes: {
          status: string;
          check_in: string;
          check_out: string;
          guests: {
            adults: number;
            children: number;
            infants: number;
          };
        };
      }[];
    };
  };
};

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [services, setServices] = useState<Record<number, Service>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndCartData = async () => {
      setLoading(true);
      try {
        const token = cookie.get("jwt");
        if (!token) throw new Error("JWT token not found");

        // Fetch user
        const userResponse = await getUserMeLoader();
        const user = userResponse.data;
        if (!user) throw new Error("User not found");

        const userId = user.id;

        // Fetch cart items
        const items = await fetchCartItems(userId);
        setCartItems(items);

        // console.log("items", items);

        // Fetch services
        const serviceIds = [
          ...new Set(
            items.flatMap((item) => item.attributes.extraServices || [])
          ),
        ];
        const serviceRequests = serviceIds.map((id) =>
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
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
      } catch (error: any) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCartData();
  }, []);

  const handleRemoveItem = async (id: number) => {
    try {
      const token = cookie.get("jwt");
      const user = await getUserMeLoader();

      if (!user || !user.jwt) throw new Error("User not authenticated");

      // Delete the item from the cart
      await DeleteToCart(id, user.jwt);

      // Fetch the updated cart items
      const fetchedCartItems = await fetchCartItems(user.id, user.jwt);
      setCartItems(fetchedCartItems);

      // Recalculate total price
      const updatedTotal = fetchedCartItems.reduce((sum, item) => {
        const itemTotal =
          (item.attributes.amount || 0) * (item.attributes.quantity || 0);
        const servicesTotal = (item.attributes.extraServices || []).reduce(
          (serviceSum, serviceId) => {
            const service = services[serviceId];
            return serviceSum + (service?.attributes.price || 0);
          },
          0
        );
        return sum + itemTotal + servicesTotal;
      }, 0);
      setTotal(updatedTotal);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const proceedToCheckout = () => {
    const token = cookie.get("jwt");
    if (!token) {
      router.push("/signin");
      return;
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("total", JSON.stringify(total));
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => {
          const imageUrl = item.attributes.image || "";
          return (
            <div
              key={item.id}
              className="flex items-center mb-4 p-4 bg-white rounded-lg shadow-sm"
            >
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Room Image"
                  width={100}
                  height={75}
                  className="object-cover rounded"
                />
              )}
              <div className="ml-4">
                <p>Price: ${item.attributes.amount}</p>
                <p>Quantity: {item.attributes.quantity}</p>
                <p>Total Amount: ${item.attributes.amount}</p>
                {item.attributes.extraServices?.map((serviceId) => {
                  const service = services[serviceId];
                  return service ? (
                    <p key={service.id}>
                      {service.attributes.name} - ${service.attributes.price}
                    </p>
                  ) : null;
                })}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}
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
