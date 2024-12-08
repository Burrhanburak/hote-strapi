import axios from "axios";

export const fetchServices = async (serviceIds: number[], token: string) => {
  try {
    const serviceRequests = serviceIds.map((id) =>
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
    const serviceResponses = await Promise.all(serviceRequests);
    const serviceData = serviceResponses.reduce((acc, response) => {
      const service = response.data.data;
      acc[service.id] = service;
      return acc;
    }, {} as Record<number, any>);
    return serviceData;
  } catch (error: any) {
    console.error(
      "Error fetching services:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
