import axios from "axios";
import { fetchComments, createComment } from "../services/commentService";

export async function makeComment(
  roomId: number,
  comment_text: string,
  rating: number,
  userId: number
) {
  try {
    return await createComment(roomId, comment_text, rating, userId);
  } catch (error) {
    console.error("Failed to add comment", error);
    throw error;
  }
}

export const getComments = async (roomId: number) => {
  try {
    return await fetchComments(roomId);
  } catch (error) {
    console.error("Failed to fetch comments", error);
    throw error;
  }
};
