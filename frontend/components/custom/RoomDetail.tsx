// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { Card } from "../ui/card";
// import RoomReservationForm from "../forms/RoomReservationForm";
// import CommentForm from "../forms/CommentForm";
// import { getUserMeLoader } from "@/lib/services/get-user-me-loader";
// import { fetchComments } from "@/lib/services/commentService";
// import CommentCard from "./CommentCard";
// import cookie from "js-cookie";

// interface RoomDetailProps {
//   roomData: any;
// }

// interface Room {
//   id: number;
//   attributes: {
//     name: string;
//     description: string;
//     createdAt: string;
//     updatedAt: string;
//     publishedAt: string;
//     room_number: number;
//     comment: {
//       data: {
//         id: number;
//         attributes: {
//           comment_text: string;
//           rating: number;
//           createdAt: string;
//           updatedAt: string;
//           publishedAt: string;
//           user: {
//             data: {
//               attributes: {
//                 username: string;
//               };
//             };
//           };
//         };
//       }[];
//     };
//     image: {
//       data: {
//         attributes: {
//           url: string;
//         };
//       }[];
//     };
//     price: number;
//     availability: boolean;
//     type: string;
//     service?: {
//       data: {
//         id: number;
//         attributes: {
//           name: string;
//         };
//       }[];
//     };
//   };
// }

// interface Comment {
//   id: number;
//   attributes: {
//     users_permissions_user: {
//       data: {
//         attributes: {
//           username: string;
//         };
//       };
//     };
//     comment_text: string;
//     rating: number;
//     createdAt: string;
//     updatedAt: string;
//     publishedAt: string;
//     room: {
//       data: {
//         id: number;
//         attributes: {
//           name: string;
//         };
//       };
//     };
//   };
// }

// const RoomDetail: React.FC<RoomDetailProps> = ({ roomData }) => {
//   const room = roomData;
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [user, setUser] = useState<any | null>(null);
//   const [isLoadingUser, setIsLoadingUser] = useState(true);
//   const [activeImage, setActiveImage] = useState<string | null>(null);

//   useEffect(() => {
//     const loadUserAndComments = async () => {
//       try {
//         const userData = await getUserMeLoader();
//         if (userData.ok) {
//           setUser(userData.data);
//           console.log(userData.data, "User Data"); // Log the user data
//         }

//         const token = cookie.get("jwt");
//         if (!token) {
//           throw new Error("JWT token not found");
//         }

//         const response = await fetchComments(room.id);
//         console.log(response, "API Response"); // Log the API response
//         if (response && response.data) {
//           const filteredComments = response.data.filter(
//             (comment: Comment) => comment.attributes.room.data.id === room.id
//           );
//           setComments(filteredComments);
//         }
//       } catch (error) {
//         console.error("Failed to load user data or comments", error);
//       } finally {
//         setIsLoadingUser(false);
//       }
//     };

//     loadUserAndComments();
//   }, [room.id]);

//   console.log(comments, "comments");

//   const imageUrl = room?.attributes?.image?.data?.[0]?.attributes?.url
//     ? new URL(
//         room.attributes.image.data[0].attributes.url,
//         process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
//       ).toString()
//     : "";

//   const services = room.attributes.service?.data || [];

//   return (
//     <div className="container mx-auto">
//       <div className="grid md:grid-cols-2 relative gap-5 px-3 py-4">
//         <div className="h-[540px] relative rounded-2xl overflow-hidden">
//           <div className="hidden md:flex justify-center items-center h-full bg-gray-200 dark:bg-gray-800 shadow-xl shadow-blue-gray-900/50">
//             {imageUrl && (
//               <Image
//                 src={imageUrl}
//                 alt={room.attributes.name}
//                 layout="fill"
//                 className="object-cover cursor-pointer scale-110 transition-all duration-300 hover:scale-100 "
//               />
//             )}
//           </div>
//           <div className="md:hidden flex justify-center items-center h-full bg-gray-200 dark:bg-gray-800 shadow-xl shadow-blue-gray-900/50">
//             {imageUrl && (
//               <Image
//                 src={imageUrl}
//                 alt={room.attributes.name}
//                 layout="fill"
//                 className="object-cover cursor-pointer scale-110 transition-all duration-300 hover:scale-100 "
//               />
//             )}
//           </div>
//           <div className=""></div>
//         </div>
//         <Card className="w-full">
//           <div className="h-60 overflow-hidden">
//             {imageUrl && (
//               <Image
//                 src={imageUrl}
//                 alt={room.attributes.name}
//                 width={200}
//                 height={150}
//                 className="object-cover"
//               />
//             )}
//           </div>

//           <h1>{room.attributes.name}</h1>
//           <p>Type: {room.attributes.type}</p>
//           <p>Price: ${room.attributes.price}</p>
//           <p>Room Number: {room.attributes.room_number}</p>
//           <p>Description: {room.attributes.description}</p>
//           <p>
// Services:{" "}
// {services.length > 0
//   ? services.map((service) => service.attributes.name).join(", ")
//   : "No services available"}
//           </p>

//           <RoomReservationForm roomId={room.id} imageUrl={imageUrl} />

//           <div className="container">
//             {!isLoadingUser && user ? (
//               <CommentForm userId={user.id} roomId={room.id} />
//             ) : !isLoadingUser ? (
//               <p>You must be logged in to leave a comment.</p>
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>

//           <div className="container">
//             <h2>Comments</h2>
//             <div className="comments-list">
//               {comments.length > 0 ? (
//                 comments.map((comment) => (
//                   <CommentCard
//                     key={comment.id}
//                     username={
//                       comment.attributes.users_permissions_user?.data
//                         ?.attributes?.username || "Anonymous"
//                     }
//                     commentText={comment.attributes.comment_text}
//                     rating={comment.attributes.rating}
//                   />
//                 ))
//               ) : (
//                 <p>No comments available.</p>
//               )}
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default RoomDetail;

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
  const [showAllPhotos, setShowAllPhotos] = useState(false);

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

  console.log(imageUrls, "imagesler");
  const services = room.attributes.service?.data?.attributes || [];

  if (showAllPhotos) {
    return (
      <div className="absolute inset-0 bg-black text-white min-h-screen p-8">
        <div className="bg-black grid gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl">Photos of {room.attributes.name}</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-1 py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Close photos
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {imageUrls.map((imgUrl, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => setActiveImage(imgUrl)}
              >
                <Image
                  src={imgUrl}
                  width={450}
                  height={250}
                  alt={room.attributes.name}
                  className="h-80 max-w-full cursor-pointer rounded-2xl object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Room Details</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden ">
          <div className="flex justify-center h-[480px] relative">
            {activeImage ? (
              <Image
                src={activeImage}
                width={540}
                height={540}
                layout="fixed"
                objectFit="cover"
                alt={room.attributes.name}
                className="h-auto w-full max-w-full rounded-2xl object-cover object-center md:h-[480px]"
              />
            ) : (
              <p>No image available</p>
            )}
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute top-2 right-2 py-2 px-4 bg-white rounded-2xl shadow shadow-md shadow-gray-500 flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                  clipRule="evenodd"
                />
              </svg>
              Show more photos
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {imageUrls.map((imgUrl, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => setActiveImage(imgUrl)}
              >
                <Image
                  src={imgUrl}
                  width={150}
                  height={150}
                  objectFit="cover"
                  alt={room.attributes.name}
                  className="h-40 max-w-full cursor-pointer rounded-2xl object-cover object-center"
                />
              </div>
            ))}
          </div>
          <div className="py-4">
            <Card className="w-full p-4">
              <h1 className="text-2xl font-bold mb-4">
                {room.attributes.name}
              </h1>
              <p className="mb-2">Type: {room.attributes.type}</p>
              <p className="mb-2">Price: ${room.attributes.price}</p>
              <p className="mb-2">Room Number: {room.attributes.room_number}</p>
              <p className="mb-2">Description: {room.attributes.description}</p>
              <p className="mb-2">Services: {services.name}</p>
            </Card>
          </div>
        </div>
        <div>
          <Card className="w-full p-4 ">
            <RoomReservationForm
              roomId={room.id}
              imageUrl={activeImage || ""}
            />

            <div className="mt-6">
              {!isLoadingUser && user ? (
                <CommentForm userId={user.id} roomId={room.id} />
              ) : !isLoadingUser ? (
                <p>You must be logged in to leave a comment.</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Comments</h2>
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      username={
                        comment.attributes.users_permissions_user?.data
                          ?.attributes?.username || "Anonymous"
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
      </div>
    </div>
  );
};

export default RoomDetail;
