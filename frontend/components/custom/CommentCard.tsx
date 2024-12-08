import React from "react";
import { Card } from "../ui/card";

interface CommentCardProps {
  username: string;
  commentText: string;
  rating: number;
}

function CommentCard({ username, commentText, rating }: CommentCardProps) {
  return (
    <Card className="card">
      <div className="card-body">
        <h5 className="card-title">Comment</h5>
        <p className="card-text">{commentText}</p>
        <p className="card-rating">Rating: {rating}</p>
        <p className="card-author">By: {username}</p>
      </div>
    </Card>
  );
}

export default CommentCard;
