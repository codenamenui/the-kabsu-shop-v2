"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import SearchNavBar from "@/components/SearchNavBar"; // Adjust the path according to your project structure

export default function SearchResultsPage() {
    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const categoryParam = searchParams.get("category"); // Get the 'category' param from the URL
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]); // Store selected categories

    // Fetch products matching the query and categories
    const fetchMerchandises = async (
        query: string | null,
        categories: number[]
    ) => {
        setLoading(true);
        let supabaseQuery = supabase.from("merchandises").select(`
            id, 
            name, 
            merchandise_pictures(merch_pic), 
            variants(price), 
            shops(name)
        `);

        // Apply name search if a query is provided
        if (query) {
            supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
        }
        console.log(categories);
        // Apply category filtering if categories are selected
        if (categories.length > 0) {
            supabaseQuery = supabaseQuery.in("cat_id", categories);
        }

        const { data, error } = await supabaseQuery;
        console.log(data);
        if (error) {
            console.error(error);
        } else {
            setResults(data || []);
        }
        setLoading(false);
    };

    // Fetch data when query or selectedCategories changes
    useEffect(() => {
        // Parse the category parameter and convert it to an array of numbers
        if (categoryParam) {
            const categoryIds = categoryParam.split(",").map(Number);
            setSelectedCategories(categoryIds); // Set selected categories from URL param
        }
        fetchMerchandises(query, selectedCategories);
    }, [query, categoryParam]); // Listen for changes in query and categoryParam

    // Fetch merchandises whenever selectedCategories changes
    useEffect(() => {
        fetchMerchandises(query, selectedCategories);
    }, [selectedCategories]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex">
            <SearchNavBar onCategoryChange={setSelectedCategories} />

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
                                {merch.name} - ${merch.variants[0].price} <br />
                                {merch.shops.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
}
