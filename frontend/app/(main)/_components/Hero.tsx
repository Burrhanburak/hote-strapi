"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import HeroForm from "@/components/forms/HeroForm";

export const SliderImage = [
  {
    id: 1,
    href: "/bg.jpg",
    title: "Slide 1",
    description: "Slide 1 Description",
  },
  {
    id: 2,
    href: "/bgtwo.jpg",
    title: "Slide 2",
    description: "Slide 2 Description",
  },
];

const Hero = () => {
  return (
    <>
      <div className=" p-4 lg:p-4 w-full ">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {SliderImage.map((item) => (
              <CarouselItem key={item.id}>
                <div className="h-[34rem] md:h-[32rem] lg:h-[44rem] overflow-hidden rounded-lg relative">
                  <Image
                    src={item.href}
                    alt={item.title}
                    width={1920}
                    height={1080}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <div className="flex flex-col justify-center h-full bg-opacity-50 absolute inset-0 rounded-lg">
                    <div className="container mx-auto px-4">
                      <h1 className="text-2xl md:text-4xl font-bold text-white">
                        {item.title}
                      </h1>
                      <p className="text-sm md:text-base text-white">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 h-10" />
          <CarouselNext className="right-2 h-10" />
        </Carousel>
      </div>

      <div className=" p-2 lg:-bottom-10 w-full overflow-hidden">
        <div className="bg-black">
          <HeroForm />
        </div>
      </div>
    </>
  );
};

export default Hero;
