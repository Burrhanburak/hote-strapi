import { Metadata } from "next";
import axios from "axios";
import RoomDetail from "@/components/custom/RoomDetail";

export const dynamic = "force-dynamic";

interface RoomDetailPageProps {
  params: {
    slug: string;
  };
}

const fetchRoomData = async (slug: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/rooms?filters[slug][$eq]=${slug}&populate=*`
  );
  if (response.data.data.length === 0) {
    return null;
  }
  return response.data.data[0];
};

export async function generateMetadata({
  params,
}: RoomDetailPageProps): Promise<Metadata> {
  const roomData = await fetchRoomData(params.slug);
  if (!roomData) {
    return {
      title: "Room Not Found",
    };
  }
  return {
    title: roomData.attributes.name,
  };
}

const RoomDetailPage = async ({ params }: RoomDetailPageProps) => {
  const roomData = await fetchRoomData(params.slug);

  if (!roomData) {
    return <div>Room not found</div>;
  }

  return <RoomDetail roomData={roomData} />;
};

export default RoomDetailPage;
