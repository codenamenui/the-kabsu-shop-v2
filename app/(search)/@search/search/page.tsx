"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SearchResultsPage() {
    const supabase = createClientComponentClient();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products matching the query
        const fetchMerchandises = async () => {
            setLoading(true);
            if (query) {
                const { data, error } = await supabase
                    .from("merchandises") // Table name in Supabase
                    .select(
                        `id, name, merchandise_pictures(merch_pic), variants(price), shops(name)`
                    )
                    .ilike("name", `%${query}%`); // Case-insensitive partial match
                console.log(data);
                if (error) {
                    console.error(error);
                } else {
                    setResults(data || []);
                }
            }
            setLoading(false);
        };

        fetchMerchandises();
    }, [query]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Search Results for: {query}</h1>
            {results.length > 0 ? (
                <ul className="flex flex-col gap-2 c">
                    {results.map((merch) => {
                        console.log(merch);
                        return (
                            <li key={merch.id} className="card w-3/12">
                                <Image
                                    alt="loading..."
                                    width={50}
                                    height={50}
                                    src={
                                        merch.merchandise_pictures[0].merch_pic
                                    }
                                />
                                {merch.name} - ${merch.variants[0].price} <br />
                                {merch.shops.name}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}
