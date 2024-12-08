import { getAuthToken } from "@/lib/services/get-token";
import { Room } from "@/lib/types";
import { flattenAttributes } from "@/lib/utils";
import qs from "qs";

const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rooms?populate=*`;

const baseUrl = "http://localhost:1337";

export const getRooms = async (
  queryString: string,
  currentPage: number
): Promise<any> => {
  const PAGE_SIZE = 4;
  const query = qs.stringify({
    populate: "*", // Tüm ilişkili verileri de dahil et
    sort: ["createdAt:desc"],
    filters: {
      $or: [
        { name: { $containsi: queryString } },
        { description: { $containsi: queryString } },
      ],
    },
    pagination: {
      pageSize: PAGE_SIZE,
      page: currentPage,
    },
  });
  const url = new URL("/api/rooms", baseUrl);
  url.search = query;

  return fetchData(url.href);
};

export async function fetchData(url: string): Promise<any> {
  const authToken = getAuthToken();
  const headers = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  };

  try {
    const response = await fetch(url, (await authToken) ? headers : {});
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // or return null;
  }
}
