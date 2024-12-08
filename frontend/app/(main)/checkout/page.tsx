"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import CheckoutForm from "@/components/custom/CheckoutForm";
import cookie from "js-cookie";
import { fetchServices } from "@/actions/fetchServices";
import { fetchCartItems } from "@/actions/fetchCartItems";
import { DeleteToCart } from "@/actions/deleteToCart";

interface CartItem {
  id: number;
  attributes: {
    amount: number;
    quantity: number;
    roomId: number;
    extraServices?: number[];
    image: string;
    name: string;
  };
}

interface Service {
  id: number;
  attributes: {
    name: string;
    price: number;
  };
}

const CheckoutClient = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Record<number, Service>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserMeLoader();
        if (userResponse.ok && userResponse.data) {
          setUser(userResponse.data);
          const fetchedCartItems = await fetchCartItems(
            userResponse.data.id,
            userResponse.data.reservationId
          );
          console.log("Fetched cart items:", fetchedCartItems); // Log cart items
          setCartItems(fetchedCartItems);

          // Fetch services
          const token = cookie.get("jwt");
          const serviceIds = [
            ...new Set(
              fetchedCartItems.flatMap(
                (item) => item.attributes.extraServices || []
              )
            ),
          ];
          const fetchedServices = await fetchServices(serviceIds, token);
          setServices(fetchedServices);

          // Calculate total price
          const totalAmount = fetchedCartItems.reduce((sum, item) => {
            const itemTotal =
              (item.attributes.amount || 0) * (item.attributes.quantity || 0);
            const servicesTotal = (item.attributes.extraServices || []).reduce(
              (serviceSum, serviceId) => {
                const service = fetchedServices[serviceId];
                return serviceSum + (service?.attributes.price || 0);
              },
              0
            );
            return sum + itemTotal + servicesTotal;
          }, 0);
          setTotal(totalAmount);
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    setLoading(false);
  }, [router]);

  const handleDeleteFromCart = async (id: number) => {
    try {
      if (user?.jwt) {
        await DeleteToCart(id, user.jwt);
        const fetchedCartItems = await fetchCartItems(user.id, user.jwt);
        setCartItems(fetchedCartItems);

        const totalAmount = fetchedCartItems.reduce((sum, item) => {
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
        setTotal(totalAmount);
      }
    } catch (error) {
      console.error("Error deleting item from cart:", error);
      alert("Failed to delete item from cart. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {cartItems.map((item) => (
        <div key={item.id} className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Room {item.attributes.roomId}
          </h2>
          <div className="relative w-32 h-32 mb-2">
            {item.attributes.image && (
              <Image
                src={item.attributes.image}
                alt="Room Image"
                width={200}
                height={150}
                className="object-cover"
              />
            )}
          </div>
          <p className="text-gray-700 mb-2">Price: ${item.attributes.amount}</p>
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
                  {item.attributes.extraServices.map((serviceId) => (
                    <li key={serviceId}>
                      {services[serviceId]?.attributes.name} - $
                      {services[serviceId]?.attributes.price}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteFromCart(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-lg"
                >
                  Remove
                </button>
              </div>
            )}
        </div>
      ))}
      <h2 className="text-xl font-bold mt-4">Total: ${total}</h2>

      <CheckoutForm
        subtotal={total.toString()}
        userId={user?.id}
        jwt={user?.jwt}
        items={cartItems}
      />
    </div>
  );
};

export default CheckoutClient;
