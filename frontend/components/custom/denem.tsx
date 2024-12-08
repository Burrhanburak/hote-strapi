"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "../ui/card";
import RoomReservationForm from "../forms/RoomReservationForm";
import CommentForm from "../forms/CommentForm";
import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
import { fetchComments } from "@/lib/services/commentService";
import CommentCard from "./CommentCard";
import cookie from "js-cookie";
import { MoveLeft, MoveRight } from "lucide-react";
interface RoomDetailProps {
  roomData: any;
}

interface Room {
  id: number;
  attributes: {
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    room_number: number;
    comment: {
      data: {
        id: number;
        attributes: {
          comment_text: string;
          rating: number;
          createdAt: string;
          updatedAt: string;
          publishedAt: string;
          user: {
            data: {
              attributes: {
                username: string;
              };
            };
          };
        };
      }[];
    };
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

interface Comment {
  id: number;
  attributes: {
    users_permissions_user: {
      data: {
        attributes: {
          username: string;
        };
      };
    };
    comment_text: string;
    rating: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    room: {
      data: {
        id: number;
        attributes: {
          name: string;
        };
      };
    };
  };
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomData }) => {
  const room = roomData;
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadUserAndComments = async () => {
      try {
        const userData = await getUserMeLoader();
        if (userData.ok) {
          setUser(userData.data);
          console.log(userData.data, "User Data"); // Log the user data
        }

        const token = cookie.get("jwt");
        if (!token) {
          throw new Error("JWT token not found");
        }

        if (room.attributes.image.data.length > 0) {
          setActiveImage(room.attributes.image.data[0].attributes.url);
        }

        const response = await fetchComments(room.id);
        console.log(response, "API Response"); // Log the API response
        if (response && response.data) {
          const filteredComments = response.data.filter(
            (comment: Comment) => comment.attributes.room.data.id === room.id
          );
          setComments(filteredComments);
        }
      } catch (error) {
        console.error("Failed to load user data or comments", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserAndComments();
  }, [room.id]);

  const imageUrls = room.attributes.image.data.map(
    (img: any) => img.attributes.url
  );

  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  console.log(imageUrls, "imagesler");

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 relative gap-5 px-3 py-4">
        <div className="h-[540px] relative rounded-2xl overflow-hidden">
          <div className="hidden md:flex justify-center items-center h-full w-full bg-gray-200 dark:bg-gray-800 shadow-xl shadow-blue-gray-900/50">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={`Room Photo ${currentPhotoIndex + 1}`}
                layout="fill"
                objectFit="cover"
                className="object-cover w-full h-full cursor-pointer scale-110 transition-all duration-300 hover:scale-100"
              />
            ) : (
              <p>No image available</p>
            )}
          </div>

          <div className="md:hidden flex justify-center items-center w-full h-full">
            <Image
              src={imageUrls[currentPhotoIndex]}
              alt={`Room Photo ${currentPhotoIndex + 1}`}
              className="img"
              width={150}
              height={150}
              onClick={() => openModal(0)}
            />
          </div>

          <div className="md:hidden flex justify-between items-center">
            <div className="flex space-x-2">
              <MoveLeft className="cursor-pointer" onClick={handlePrevious} />
              <MoveRight className="cursor-pointer" onClick={handleNext} />
            </div>
            <span>
              {currentPhotoIndex + 1} / {imageUrls.length}
            </span>
          </div>

          <div className=" md:grid grid-cols-2 h-full gap-5">
            {imageUrls.map(
              (imgUrl: string, index: React.Key | null | undefined) => (
                <div key={index} className="">
                  <Image
                    src={imgUrl}
                    width={600}
                    height={500}
                    objectFit="cover"
                    alt={room.attributes.name}
                    className="object-cover cursor-pointer scale-110 transition-all duration-300 hover:scale-100"
                  />
                </div>
              )
            )}
          </div>

          {imageUrls.length > 2 && (
            <div
              className="cursor-pointer relative h-64 rounded-2xl overflow-hidden"
              onClick={() => openModal(2)}
            >
              <Image
                width={150}
                height={150}
                src={imageUrls[1]}
                alt={`Room Photo ${2}`}
                className="img"
              />
              <div className="absolute cursor-pointer text-white inset-0 flex justify-center bg-[rgba(0,0,0,0.5)] items-center text-2xl">
                + {imageUrls.length - 2}
              </div>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-90 z-[55]">
            <div className="h-[75vh] w-[320px] md:w-[700px] relative">
              <Image
                src={imageUrls[currentPhotoIndex]}
                alt={`Room Photo ${currentPhotoIndex + 1}`}
                width={150}
                height={150}
                className="img"
              />
              <div className="flex justify-between items-center py-3">
                <div className="flex space-x-2 items-center text-white">
                  <MoveLeft
                    className="cursor-pointer"
                    onClick={handlePrevious}
                  />
                  <MoveRight className="cursor-pointer" onClick={handleNext} />
                </div>
                <span className="text-white text-sm">
                  {currentPhotoIndex + 1} / {imageUrls.length}
                </span>
              </div>
              <button
                className="absolute top-2 right-2 text-white text-lg"
                onClick={closeModal}
              >
                Kapat
              </button>
            </div>
          </div>
        )}
      </div>
      <Card className="w-full">
        <h1>{room.attributes.name}</h1>
        <p>Type: {room.attributes.type}</p>
        <p>Price: ${room.attributes.price}</p>
        <p>Room Number: {room.attributes.room_number}</p>
        <p>Description: {room.attributes.description}</p>
        <p>
          Services:{" "}
          {room.attributes.service?.data.length > 0
            ? room.attributes.service.data
                .map((service) => service.attributes.name)
                .join(", ")
            : "No services available"}
        </p>

        <RoomReservationForm roomId={room.id} imageUrl={activeImage || ""} />

        <div className="container">
          {!isLoadingUser && user ? (
            <CommentForm userId={user.id} roomId={room.id} />
          ) : !isLoadingUser ? (
            <p>You must be logged in to leave a comment.</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="container">
          <h2>Comments</h2>
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  username={
                    comment.attributes.users_permissions_user?.data?.attributes
                      ?.username || "Anonymous"
                  }
                  commentText={comment.attributes.comment_text}
                  rating={comment.attributes.rating}
                />
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoomDetail;
