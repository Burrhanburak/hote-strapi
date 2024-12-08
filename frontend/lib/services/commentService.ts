import axios from "axios";
import { getStrapiURL } from "../utils";
import { getUserMeLoader } from "./get-user-me-loader";
import cookie from "js-cookie";
import { getAuthToken } from "./get-token";

interface Comment {
  id: number;
  comment_text: string;
  rating: number;
  userId: number;

  room: {
    id: number;
  };
  createdAt: string;
}

const baseUrl = getStrapiURL();

// export const fetchComments = async (roomId: number): Promise<Comment[]> => {
//   try {
//     const response = await axios.get(
//       `${baseUrl}/api/comments?roomId=${roomId}`,
//       {
//         params: { roomId },
//       }
//     );
//     const data = response.data;

//     // Ensure data is an array
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error("Failed to fetch comments", error);
//     return []; // Return an empty array on error
//   }
// };

// export const fetchComments = async (roomId: number, userId: number) => {
//   try {
//     const response = await axios.get(
//       `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments?populate=*`

//       // `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments?roomId=${roomId}`
//     );
//     console.log(response.data, "Fetched comments data"); // Log fetched data
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch comments", error);
//     return { data: [] };
//   }
// };

export const fetchComments = async (roomId: number) => {
  const token = cookie.get("jwt");
  if (!token) throw new Error("JWT token not found");

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/comments?populate=users_permissions_user,room`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data, "Fetched comments data"); // Log fetched data
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments", error);
    return { data: [] };
  }
};

export const createComment = async (
  roomId: number,
  comment_text: string,
  rating: number,
  userId: number
): Promise<Comment> => {
  const url = new URL("/api/comments", baseUrl);
  const token = cookie.get("jwt");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const userResponse = await getUserMeLoader();

  if (!userResponse.ok || !userResponse.data) {
    throw new Error("Failed to load user data");
  }

  const user = userResponse.data.id;

  const commentPayload = {
    comment_text,
    rating,
    userId: userId,
    room: roomId,
  };

  try {
    const response = await fetch(url.href, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentPayload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const comment: Comment = await response.json();
    return comment;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
};
