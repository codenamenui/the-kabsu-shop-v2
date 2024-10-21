"use client";

import React, { useState } from "react";

const Categories = () => {
    const [name, setName] = useState("");
    const [picture, setPicture] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("picture", picture);
        setLoading(true);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/add-category`,
            {
                method: "POST",
                cache: "no-store",
                body: formData,
            }
        );

        setLoading(false);
        setName("");
        setPicture(null);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Add Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Category Picture */}
                <div>
                    <label
                        htmlFor="picture"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Category Picture
                    </label>
                    <input
                        type="file"
                        id="picture"
                        accept="image/*"
                        onChange={(e) =>
                            setPicture(e.target.files?.[0] || null)
                        }
                        required
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Categories;
