import Image from "next/image";
import Hero from "./_components/Hero";
import Navbar from "./_components/Navbar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import CategoryList from "./_components/CategoryList";

interface ImageProps {
  id: number;
  url: string;
  alternativeText: string;
}

interface LinkProps {
  id: number;
  url: string;
  text: string;
}
interface HeroProps {
  data: {
    heroImage: ImageProps;
    heroLinks: LinkProps[];
  };
}

export default async function Home({ data }: Readonly<HeroProps>) {
  return (
    <>
      <Hero />

      <section className="bg-white relative py-[60px] lg:py-[120px] px-3">
        <div className="container">
          <div className="max-w-[570px] mx-auto flex flex-col items-center text-center">
            <button className="bg-[var(--primary-light)] p-1 rounded-full flex items-center">
              <i className="las la-arrow-right p-2 md:p-3 rounded-full bg-primary text-white" />
              <span className="text-base sm:text-lg lg:text-xl font-medium sm:font-semibold px-2 sm:px-3 md:px-4">
                Hotel Facilities
              </span>
            </button>
            <h2 className="h2 mt-3 leading-tight">
              Exploring the Top Hotel Facilities and Amenities
            </h2>
            <p className="text-neutral-600 pt-5 pb-8 lg:pb-14">
              Real estate can be bought, sold, leased, or rented, and can be a
              valuable investment opportunity. The value of real estate can
              be...
            </p>
          </div>
          <CategoryList />
        </div>
        <div className="flex justify-center mt-10">
          <a className="btn-outline  text-primary" href="/service">
            See All Facilities
          </a>
        </div>
      </section>
    </>
  );
}
