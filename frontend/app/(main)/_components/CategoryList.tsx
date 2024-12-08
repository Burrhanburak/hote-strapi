"use client";

import { getCategories } from "@/actions/getCategories";
import { Category } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-12 gap-4 xl:gap-6">
          {categories.map((category) => {
            const imageUrl = new URL(
              category?.attributes?.image?.data?.attributes?.url,
              process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1337"
            ).toString();

            return (
              <div
                key={category.id}
                className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              >
                <div className="shadow-[rgba(0,0,0,0.1)_0px_4px_12px] rounded-xl bg-white p-4 lg:p-8 group hover:bg-primary duration-300">
                  <div className="grid place-content-center w-20 h-20 rounded-full bg-[var(--primary-light)] mb-6">
                    <Image
                      unoptimized={true}
                      src={imageUrl}
                      alt={category.attributes.name}
                      width={500}
                      height={300}
                      className="w-16 h-16"
                    />
                  </div>
                  <h4 className="mb-3 text-2xl font-semibold group-hover:text-white duration-300">
                    {category.attributes.name}
                  </h4>
                  <p className="mb-0 group-hover:text-white duration-300">
                    {category.attributes.room?.length} Rooms
                  </p>
                  <Link
                    href={`/categories/${category.attributes.slug}`}
                    className=" mt-3 text-center text-black hover:underline"
                  >
                    View More
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CategoryList;
