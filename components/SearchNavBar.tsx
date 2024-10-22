"use client";

import React, { useEffect, useState } from "react";

type Category = {
    id: number;
    name: string;
    picture: string; // Assuming the picture field contains the URL for the category image
};

const SearchNavBar = () => {
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
        <div className="flex-col border-r-2 border-gray-400 h-screen p-1">
            <div>
                <p>Categories</p>
            </div>
        </div>
    );
};

export default SearchNavBar;
