"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cookie from "js-cookie";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import { addToCart } from "@/actions/addToCart";
import { useParams } from "next/navigation";
import Image from "next/image";

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
      }[];
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

interface Service {
  id: number;
  attributes: {
    name: string;
    price: number;
  };
}

interface RoomReservationFormProps {
  roomId: number;
  imageUrl: string; // Add this prop
}

const RoomReservationForm = ({
  roomId,
  imageUrl,
}: RoomReservationFormProps) => {
  const router = useRouter();
  const params = useParams();

  const [room, setRoom] = useState<Room | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1337/api/rooms/${roomId}`
        );
        setRoom(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching room data:",
          error.response?.data || error.message
        );
      }
    };

    const fetchServicesData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/services");
        setServices(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching services data:",
          error.response?.data || error.message
        );
      }
    };

    fetchRoomData();
    fetchServicesData();
  }, [roomId]);

  useEffect(() => {
    const totalAmount =
      (room?.attributes.price || 0) +
      selectedServices.reduce((sum, id) => {
        const service = services.find((s) => s.id === id);
        return sum + (service?.attributes.price || 0);
      }, 0);
    setAmount(totalAmount);
  }, [selectedServices, room]);

  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = cookie.get("jwt");
    const userResponse = await getUserMeLoader();

    if (!token || !userResponse.ok || !userResponse.data) {
      router.push("/signin");
      return;
    }
    console.log("User data:", userResponse.data);

    try {
      const userId = userResponse.data.id;

      const reservationPayload = {
        check_in: checkInDate,
        check_out: checkOutDate,
        status: "pending",
        room: room?.id,
        services: selectedServices,
        guests: {
          adults: 1,
          children: 0,
          infants: 0,
        },
        users_permissions_user: userId,
        amount,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/reservations`,
        { data: reservationPayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error) {
        console.error("API Error Details:", response.data.error);
        throw new Error(
          response.data.error.message || "Room reservation failed"
        );
      }

      const reservationId = response.data.data.id;
      // const image = room?.attributes.image?.data?.attributes?.url || "";

      // const roomImage = room?.attributes.image?.data?.attributes.url || "";

      await addToCart(
        roomId,
        1,
        amount,
        selectedServices,
        imageUrl,
        reservationId
      );

      console.log("Reservation and add to cart successful:", response.data);
      router.push("/cart");
    } catch (error: any) {
      console.error(
        "Error during room reservation or adding to cart:",
        error.response?.data || error.message
      );
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Reserve Room {room?.attributes.name}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Check-out Date
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Extra Services
          </label>
          {services.map((service) => (
            <div key={service.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={service.id}
                onChange={() => handleServiceChange(service.id)}
                className="mr-2"
              />
              <span>
                {service.attributes.name} - ${service.attributes.price}
              </span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reserve
        </button>
      </form>
    </div>
  );
};

export default RoomReservationForm;
