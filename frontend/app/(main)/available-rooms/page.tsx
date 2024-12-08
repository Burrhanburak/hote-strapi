"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import CheckAvailabilityForm from "@/components/forms/CheckAvailabilityForm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExtraService } from "@/lib/types";
import { getServices } from "@/actions/getService";
export type Room = {
  slug: number;
  id: number;
  attributes: {
    slug: string;
    name: string;
    image: {
      data: {
        attributes: {
          url: string;
        };
      }[];
    };
    description: string;
    room_number: number;
    price: number;
    availability: boolean;
    beds: string;
    capacity: number;
    type: string;
    service: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    }[];
  };
};

interface RoomItemProps {
  room: Room;
}

const AvailableRooms = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const check_in = searchParams.get("check_in");
  const check_out = searchParams.get("check_out");
  const rooms = searchParams.get("rooms");
  const serviceIds = searchParams.getAll("services").map((id) => parseInt(id));
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [bedType, setBedType] = useState<string | undefined>(undefined);
  const [capacity, setCapacity] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rooms?populate=*`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setAvailableRooms(response.data.data);
        } else {
          console.error("Unexpected response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchExtraServices = async () => {
      try {
        const services = await getServices();
        setExtraServices(services);
      } catch (error) {
        console.error("Error fetching extra services:", error);
      }
    };

    fetchExtraServices();
  }, []);

  const filteredRooms = availableRooms.filter((room) => {
    // `services` değişkenini kontrol et
    const services = room.attributes?.service?.data || []; // service.data güvenli erişim

    // `services`'in dizi olup olmadığını kontrol et
    const servicesArray = Array.isArray(services) ? services : [services];

    const matchesServices =
      serviceIds.length > 0
        ? serviceIds.every((serviceId) => {
            return servicesArray.some(
              (service: { id: number }) => service.id === serviceId
            );
          })
        : true;

    const matchesBedType = !bedType || room.attributes.beds === bedType;
    const matchesCapacity = !capacity || room.attributes.capacity === capacity;

    return matchesServices && matchesBedType && matchesCapacity;
  });

  const bookRoom = (slug: string) => {
    router.push(`/room/${slug}`);
  };

  return (
    <div className="p-4">
      <CheckAvailabilityForm />
      <div className="mt-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => {
            const imageUrl = room.attributes?.image?.data?.[0]?.attributes?.url
              ? new URL(
                  room.attributes.image.data[0].attributes.url,
                  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
                ).toString()
              : "";
            return (
              <Card key={room.id} className="mb-4">
                <div className="flex">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={room.attributes.name}
                      width={200}
                      height={150}
                      className="object-cover"
                    />
                  )}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">
                      {room.attributes.name}
                    </h3>
                    <p>{room.attributes.description}</p>
                    <p>Price: ${room.attributes.price}</p>
                    <p>Beds: {room.attributes.beds}</p>
                    <p>Capacity: {room.attributes.capacity}</p>
                    <Button
                      className="mt-2"
                      onClick={() => bookRoom(room.attributes.slug)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <p>No rooms available matching the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;
