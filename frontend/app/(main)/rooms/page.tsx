// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { getRooms } from "@/actions/getRooms";
// import { Room } from "@/lib/types";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Search } from "@/components/custom/Search";
// import Link from "next/link";

// interface RoomCardProps {
//   id: any;
//   name: string;
//   type: string;
//   description: string;
//   price: number;
//   slug: string;
//   imageUrl: string;
// }

// const RoomCard: React.FC<RoomCardProps> = ({
//   name,
//   price,
//   description,
//   slug,
//   imageUrl,
// }) => {
//   function handleRoomClick(slug: any): void {
//     throw new Error("Function not implemented.");
//   }

//   return (
//     <Link href={`/rooms/${slug}`}>
//       <Card className="relative cursor-pointer">
//         <CardHeader>
//           <CardTitle>{name}</CardTitle>
//           <CardDescription>{description}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Image
//             src={imageUrl}
//             alt={name}
//             width={200}
//             height={150}
//             priority
//             className="object-cover"
//           />
//           <p>Price: ${price}</p>
//         </CardContent>
// <CardFooter>
//   <Button onClick={() => handleRoomClick(slug)} variant="outline">
//     View Details
//   </Button>
// </CardFooter>
//       </Card>
//     </Link>
//   );
// };

// const RoomsPage: React.FC = () => {
//   const router = useRouter();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const data: Room[] = await getRooms();
//         setRooms(data);
//       } catch (err) {
//         setError("Failed to fetch rooms. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const handleRoomClick = (slug: number) => {
//     router.push(`/rooms/${slug}`);
//   };

//   if (loading) {
//     return <p>Loading rooms...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="container mx-auto p-4 h-screen">
//       <h1 className="text-3xl font-bold py-5">Available Rooms</h1>
//       <div className="flex justify-end">
//         <Search />
//       </div>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {rooms.map((room) => {
//           const imageUrl = room.attributes?.image?.data?.[0]?.attributes?.url
//             ? new URL(
//                 room.attributes.image.data[0].attributes.url,
//                 process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
//               ).toString()
//             : "";
//           return (
//             <RoomCard
//               key={room.id}
//               id={room.id}
//               name={room.attributes.name}
//               type={room.attributes.type}
//               description={room.attributes.description}
//               price={room.attributes.price}
//               slug={room.attributes.slug}
//               imageUrl={imageUrl}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default RoomsPage;
//burasııııııı
// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { getRooms } from "@/actions/getRooms";
// import { Room } from "@/lib/types";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Search } from "@/components/custom/Search";
// import Link from "next/link";
// import { getRoomsData } from "@/lib/utils";

// interface RoomCardProps {
//   id: any;
//   name: string;
//   type: string;
//   description: string;
//   price: number;
//   slug: string;
//   imageUrl: string;
// }

// const RoomCard: React.FC<RoomCardProps> = ({
//   name,
//   price,
//   description,
//   slug,
//   imageUrl,
// }) => {
//   return (
//     <Link href={`/rooms/${slug}`}>
//       <Card className="relative cursor-pointer w-79 h-80">
//         <CardHeader>
//           <CardTitle>{name}</CardTitle>
//           <CardDescription className="truncate">{description}</CardDescription>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center justify-center">
//           <div className="relative w-full h-40">
//             <Image
//               src={imageUrl}
//               alt={name}
//               layout="fill"
//               objectFit="cover"
//               className="object-cover"
//             />
//           </div>
//           <p className="mt-2">Price: ${price}</p>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// };

// interface SearchParamProps {
//   searchParams?: {
//     query: string;
//   };
// }

// const RoomsPage: React.FC = () => {
//   const router = useRouter();
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const data = await getRoomsData();
//         setRooms(data);
//       } catch (err) {
//         setError("Failed to fetch rooms. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const handleRoomClick = (slug: number) => {
//     router.push(`/rooms/${slug}`);
//   };

//   if (loading) {
//     return <p>Loading rooms...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div className="container mx-auto p-4 h-screen">
//       <div className="flex justify-end">
//         <Search />
//       </div>
//       <h1 className="text-3xl font-bold py-5">Available Rooms</h1>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {rooms.map((room) => {
//           const imageUrl = room.attributes?.image?.data?.[0]?.attributes?.url
//             ? new URL(
//                 room.attributes.image.data[0].attributes.url,
//                 process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
//               ).toString()
//             : "";
//           return (
//             <RoomCard
//               key={room.id}
//               id={room.id}
//               name={room.attributes.name}
//               type={room.attributes.type}
//               description={room.attributes.description}
//               price={room.attributes.price}
//               slug={room.attributes.slug}
//               imageUrl={imageUrl}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Search } from "@/components/custom/Search";
import { getRooms } from "@/actions/getRooms";
import { Button } from "@/components/ui/button";
import { flattenAttributes } from "@/lib/utils";
import { getRoom } from "@/actions/getRoom";
import { PaginationComponent } from "@/components/custom/PaginationComponent";

interface RoomCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
}

export function RoomCard({
  slug,
  name,
  description,
  imageUrl,
  price,
}: Readonly<RoomCardProps>) {
  return (
    <Card className="relative cursor-pointer w-79 h-80">
      <Link href={`/room/${slug}`}>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="truncate">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="relative w-full h-40">
            <Image
              src={imageUrl}
              unoptimized={true}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="object-cover"
            />
          </div>
          <p className="mt-2">Price: ${price}</p>
        </CardContent>
      </Link>
      <CardFooter>
        <Link href={`/room/${slug}`}>View Details</Link>
      </CardFooter>
    </Card>
  );
}

interface SearchParamProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function RoomRoute({
  searchParams,
}: Readonly<SearchParamProps>) {
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const { data, meta } = await getRooms(query, currentPage);
  const pageCount = meta.pagination.pageCount;
  console.log(meta);
  // console.log(data);

  if (!data) return null;

  const flattenedData = flattenAttributes(data);
  // console.log(flattenedData);

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Search />
      {/* <span>Query: {query}</span> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flattenedData.map((room: any) => {
          const imageUrl = room?.image?.data?.[0]?.url
            ? new URL(
                room.image.data[0].url,
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
              ).toString()
            : "";

          return (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              price={room.price}
              slug={room.slug}
              imageUrl={imageUrl}
            />
          );
        })}
      </div>

      <PaginationComponent pageCount={pageCount} />
    </div>
  );
}
