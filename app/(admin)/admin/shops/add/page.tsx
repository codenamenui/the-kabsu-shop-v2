"use client";

import React, { useEffect, useState } from "react";
import FormInput from "@/components/ProfileInputComponent";
import { addStoreInfo } from "@/app/(admin)/shops/add/actions";
import Image from "next/image";

const AddStore = () => {
    const [shopName, setShopName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [socialMedia, setSocialMedia] = useState<string>("");
    const [contactNumber, setContactNumber] = useState<string>("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // For image preview
    const [officers, setOfficers] = useState([]);
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        const get = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/view-user`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                }
            );
            const { data } = await (await res).json();
            setUsers(data);
            console.log(data);
        };
        get();
    };

    const addOfficer = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setOfficers((prevOfficers) => [...prevOfficers, val]);
        e.target.value = "";
    };

    const removeOfficer = (officer: string) => {
        console.log(officer);
        setOfficers((prevOfficers) =>
            prevOfficers.filter((off) => off !== officer)
        );
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfilePicture(file); // Set the file in the state
            setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the image
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Create a new FormData object to send form data along with the image
        const formData = new FormData();
        formData.append("shopName", shopName);
        formData.append("email", email);
        formData.append("socialMedia", socialMedia);
        formData.append("contactNumber", contactNumber);

        if (profilePicture) {
            formData.append("profilePicture", profilePicture); // Append profile picture file
        }

        addStoreInfo(formData, officers);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                {/* Shop Name */}
                <FormInput
                    label="Shop Name"
                    type="text"
                    name="shopName"
                    id="shopName"
                    value={shopName}
                    placeholder="Enter shop name..."
                    onChange={(e) => setShopName(e.target.value)}
                />

                {/* Email */}
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    placeholder="Enter email..."
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Social Media Page */}
                <FormInput
                    label="Social Media Page"
                    type="text"
                    name="socialMedia"
                    id="socialMedia"
                    value={socialMedia}
                    placeholder="Enter social media page..."
                    onChange={(e) => setSocialMedia(e.target.value)}
                />

                {/* Contact Number */}
                <FormInput
                    label="Contact Number"
                    type="tel"
                    name="contactNumber"
                    id="contactNumber"
                    value={contactNumber}
                    placeholder="Enter contact number..."
                    onChange={(e) => setContactNumber(e.target.value)}
                />

                {/* Profile Picture Upload */}
                <div className="flex flex-col">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        accept="image/*" // Restrict file types to images
                        onChange={handleFileChange} // Handle the file selection
                    />

                    {/* Display the image preview */}
                    {previewImage && (
                        <div className="mt-4">
                            <p>Image Preview:</p>
                            <Image
                                src={previewImage}
                                alt="Profile Preview"
                                className="w-32 h-32 object-cover border border-gray-300"
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    {officers &&
                        officers.map((officer) => {
                            return (
                                <div
                                    onClick={() => removeOfficer(officer)}
                                    key={officer}
                                    className="button-outline cursor-pointer"
                                >
                                    {officer}
                                </div>
                            );
                        })}
                </div>

                <select
                    name="user"
                    onChange={(e) => addOfficer(e)}
                    className="dropdown"
                >
                    <option value=""></option>
                    {users &&
                        users.map((user) => {
                            if (!officers.includes(user.id)) {
                                return (
                                    <option key={user.id} value={user.id}>
                                        {user.id}
                                    </option>
                                );
                            }
                        })}
                </select>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddStore;
