"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

type Category = {
    id: number;
    name: string;
    picture: string; // Assuming the picture field contains the URL for the category image
};

interface SearchNavBarProps {
    onCategoryChange: (selectedCategories: number[]) => void; // To send selected categories to parent component
}

const SearchNavBar: React.FC<SearchNavBarProps> = ({ onCategoryChange }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const router = useRouter(); // Initialize useRouter

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

    const handleCategoryChange = (categoryId: number) => {
        const updatedSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId) // Remove if already selected
            : [...selectedCategories, categoryId]; // Add if not selected

        setSelectedCategories(updatedSelected);
        onCategoryChange(updatedSelected); // Notify parent component of the change

        // Update the URL with the new search parameters
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("category", updatedSelected.join(",")); // Set the 'category' param to the selected IDs
        router.push(`/search?${queryParams.toString()}`); // Update the URL without reloading
    };

    return (
        <div className="flex-col border-r-2 border-gray-400 h-screen p-1">
            <div>
                <p>Categories</p>
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            onChange={() => handleCategoryChange(category.id)}
                            checked={selectedCategories.includes(category.id)}
                        />
                        <label htmlFor={`category-${category.id}`}>
                            {category.name}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchNavBar;
