"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ExtraService {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
  };
}

const CheckAvailabilityForm = () => {
  const router = useRouter();
  const [check_in, setCheckIn] = useState<string>("");
  const [check_out, setCheckOut] = useState<string>("");
  const [rooms, setRooms] = useState<number>(1);
  const [extraServices, setExtraServices] = useState<ExtraService[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [bedTypes, setBedTypes] = useState<string[]>([]);
  const [selectedBedType, setSelectedBedType] = useState<string>("");
  const [capacities, setCapacities] = useState<number[]>([]);
  const [selectedCapacity, setSelectedCapacity] = useState<number>(0);

  useEffect(() => {
    const fetchExtraServices = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services?populate=*`
        );
        setExtraServices(response.data.data);
      } catch (error) {
        console.error("Error fetching extra services:", error);
      }
    };
    fetchExtraServices();
  }, []);

  useEffect(() => {
    const fetchRoomAttributes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rooms?populate=*`
        );
        const roomsData = response.data.data;
        const bedTypesSet = new Set<string>();
        const capacitiesSet = new Set<number>();

        roomsData.forEach((room: any) => {
          bedTypesSet.add(room.attributes.beds);
          capacitiesSet.add(room.attributes.capacity);
        });

        setBedTypes(Array.from(bedTypesSet));
        setCapacities(Array.from(capacitiesSet));
      } catch (error) {
        console.error("Error fetching room attributes:", error);
      }
    };
    fetchRoomAttributes();
  }, []);

  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const searchParams = new URLSearchParams();
    if (check_in) searchParams.set("check_in", check_in);
    if (check_out) searchParams.set("check_out", check_out);
    searchParams.set("rooms", rooms.toString());
    selectedServices.forEach((serviceId) => {
      searchParams.append("services", serviceId.toString());
    });
    if (selectedBedType) searchParams.set("beds", selectedBedType);
    if (selectedCapacity)
      searchParams.set("capacity", selectedCapacity.toString());

    try {
      router.push(`/available-rooms?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex justify-center overflow-hidden">
      <div className="max-w-7xl p-2 w-full">
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <Label htmlFor="check_in" className="block mb-2">
              Check-In Date
            </Label>
            <Input
              type="date"
              id="check_in"
              value={check_in}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="check_out" className="block mb-2">
              Check-Out Date
            </Label>
            <Input
              type="date"
              id="check_out"
              value={check_out}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="rooms" className="block mb-2">
              Rooms
            </Label>
            <Input
              type="number"
              id="rooms"
              value={rooms}
              onChange={(e) => setRooms(parseInt(e.target.value))}
              min={1}
              className="border p-2 rounded"
            />
          </div>
          <div className="mt-4">
            <Label className="block mb-2">Extra Services</Label>
            {extraServices.map((service) => (
              <div key={service.id} className="mb-2">
                <input
                  type="checkbox"
                  id={`service-${service.id}`}
                  checked={selectedServices.includes(service.id)}
                  onChange={() => handleServiceChange(service.id)}
                />
                <label htmlFor={`service-${service.id}`} className="ml-2">
                  {service.attributes.name} (${service.attributes.price})
                </label>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Check Availability
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckAvailabilityForm;
