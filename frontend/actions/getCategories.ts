import { Category } from "@/lib/types";
import axios from "axios";

const Urls = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/categories?populate=*`;

const url = "http://localhost:1337/api/categories?populate=*";

export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get(url);
  const data = res.data.data;
  return data;
};
