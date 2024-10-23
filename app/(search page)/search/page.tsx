"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

const SearchPage = () => {
    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const categoryParam = searchParams.get("category");
    const [shops, setShops] = useState([]);
    const [selectedShops, setSelectedShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [results, setResults] = useState([]);
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

    useEffect(() => {
        const getShops = async () => {
            const res = await fetch("/api/shop/view-store-names", {
                cache: "no-store",
            });
            const data = await res.json();
            setShops(data.data);
        };
        getShops();
    }, []);

    // Fetch products matching the query and categories
    const fetchMerchandises = async (
        query: string | null,
        categories: string[]
    ) => {
        let supabaseQuery = supabase.from("merchandises").select(`
            id, 
            name, 
            merchandise_pictures(merch_pic), 
            variants(price), 
            shops(name),
            categories_per(id, cat_id)

        `);

        // Apply name search if a query is provided
        if (query) {
            supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
        }

        const { data, error } = await supabaseQuery;
        let filteredResults = data;

        if (categories.length > 0) {
            // Filter the data to only include items that have at least one matching category
            filteredResults = data.filter((item) => {
                // Check if item has categories_per and if any of its cat_id is in the selected categories
                return item.categories_per?.some((category) =>
                    categories.includes(category.cat_id)
                );
            });
        }

        if (error) {
            console.error(error);
        } else {
            setResults(filteredResults || []);
        }
    };

    // Fetch data when query or selectedCategories changes
    useEffect(() => {
        // Parse the category parameter and convert it to an array of numbers
        if (categoryParam) {
            const categoryIds = categoryParam.split(",").map(Number);
            setSelectedCategories(categoryIds); // Set selected categories from URL param
        }
        fetchMerchandises(query, selectedCategories);
        console.log(shops);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, categoryParam]); // Listen for changes in query and categoryParam

    const handleCategoryChange = (categoryId: number) => {
        const updatedSelected = selectedCategories.includes(categoryId)
            ? selectedCategories.filter((id) => id !== categoryId) // Remove if already selected
            : [...selectedCategories, categoryId]; // Add if not selected

        setSelectedCategories(updatedSelected);

        // Update the URL with the new search parameters
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("category", updatedSelected.join(",")); // Set the 'category' param to the selected IDs
        router.push(`/search?${queryParams.toString()}`); // Update the URL without reloading
    };

    return (
        <div>
            <div className="flex">
                <div className="flex-col border-r-2 border-gray-400 h-screen p-1">
                    <div>
                        <p>Categories</p>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="checkbox"
                                    id={`category-${category.id}`}
                                    onChange={() =>
                                        handleCategoryChange(category.id)
                                    }
                                    checked={selectedCategories.includes(
                                        category.id
                                    )}
                                />
                                <label htmlFor={`category-${category.id}`}>
                                    {category.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-grow">
                    <h1>Search Results for: {query}</h1>
                    {results.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {results.map((merch) => (
                                <li key={merch.id} className="card w-3/12">
                                    {merch.merchandise_pictures &&
                                    merch.merchandise_pictures.length > 0 ? (
                                        <Image
                                            alt="loading..."
                                            width={50}
                                            height={50}
                                            src={
                                                merch.merchandise_pictures[0]
                                                    .merch_pic
                                            }
                                        />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    {merch.name} - ${merch.variants[0].price}{" "}
                                    <br />
                                    {merch.shops.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
