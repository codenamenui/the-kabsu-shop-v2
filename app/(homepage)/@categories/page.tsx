"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Category = {
    id: number;
    name: string;
    picture: string; // Assuming the picture field contains the URL for the category image
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getCategories = async () => {
            const res = await fetch("/api/profile/view-categories", {
                cache: "no-store",
            });
            const data = await res.json();
            setCategories(data.data);
        };
        getCategories();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                    console.log(category);
                    return (
                        <div
                            key={category.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden"
                        >
                            <div className="relative h-48 w-full">
                                {/* Next.js Image component for optimized image loading */}
                                <Image
                                    src={category.picture} // Use a default image if category.picture is missing
                                    alt={category.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold">
                                    {category.name}
                                </h2>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoriesPage;
