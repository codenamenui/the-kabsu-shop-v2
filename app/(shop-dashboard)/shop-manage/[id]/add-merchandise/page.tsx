"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const AddMerch = () => {
    const { id } = useParams();
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [infoPicture, setInfoPicture] = useState<File | null>(null);
    const [variants, setVariants] = useState<
        { variantPicture: File | null; name: string; price: number | string }[]
    >([]);
    const [merchPics, setMerchPics] = useState<File[]>([]);
    const [options, setOptions] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const getOptions = async () => {
            const res = await fetch("/api/view-categories");
            const { data: cats, error } = await res.json();
            setOptions(cats);
        };
        getOptions();
    }, []);

    const handleAddCategory = (e) => {
        const newCategoryId = e.target.value;
        if (newCategoryId && !selectedCategories.includes(newCategoryId)) {
            console.log(newCategoryId);
            setSelectedCategories((prev) => [...prev, newCategoryId]);
        }
        // Reset the select field after selection
        e.target.value = "";
    };

    const handleRemoveCategory = (id) => {
        setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    };

    // Function to add a variant with an empty name, picture, and price
    const addVariant = () => {
        setVariants([
            ...variants,
            { name: "", variantPicture: null, price: "" },
        ]);
    };

    // Function to remove variant by index
    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    // Function to remove merchandise picture by index
    const removeMerchPic = (index: number) => {
        setMerchPics((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior

        const supabase = createClientComponentClient();
        try {
            const info_url = `info_${name}_${Date.now()}.png`;
            // Upload info picture
            const { error: storageError } = await supabase.storage
                .from("info-picture")
                .upload(info_url, infoPicture);

            if (storageError) {
                throw storageError;
            }

            const {
                data: { publicUrl: infoPictureUrl },
            } = supabase.storage.from("info-picture").getPublicUrl(info_url);

            // Insert merchandise into database
            const { data: merch, error: insertError } = await supabase
                .from("merchandises")
                .insert([
                    {
                        name: name,
                        description: desc,
                        shop_id: id,
                        info_pic: infoPictureUrl,
                    },
                ])
                .select()
                .single();

            if (insertError) {
                throw insertError;
            }

            // Upload merchandise pictures
            for (let i = 0; i < merchPics.length; i++) {
                const merch_url = `merch_${name}_${i + 1}_${Date.now()}.png`;
                const { error: storageError } = await supabase.storage
                    .from("merch-picture")
                    .upload(merch_url, merchPics[i]);

                if (storageError) {
                    throw storageError;
                }

                const {
                    data: { publicUrl: merchUrl },
                } = supabase.storage
                    .from("merch-picture")
                    .getPublicUrl(merch_url);

                const { error: merch_error } = await supabase
                    .from("merchandise_pictures")
                    .insert([{ merch_pic: merchUrl, merch_id: merch.id }]);

                if (merch_error) {
                    throw merch_error;
                }
            }

            // Upload variants
            for (let i = 0; i < variants.length; i++) {
                const variant_url = `variant_${name}_${
                    i + 1
                }_${Date.now()}.png`;
                if (variants[i].variantPicture) {
                    const { error: storageError } = await supabase.storage
                        .from("variant-picture")
                        .upload(variant_url, variants[i].variantPicture);

                    if (storageError) {
                        throw storageError;
                    }

                    const {
                        data: { publicUrl: variantUrl },
                    } = supabase.storage
                        .from("variant-picture")
                        .getPublicUrl(variant_url);

                    const { error: merch_error } = await supabase
                        .from("variants")
                        .insert([
                            {
                                variant_pic: variantUrl,
                                name: variants[i].name,
                                price: variants[i].price, // Include price in the insert
                                merch_id: merch.id,
                            },
                        ]);

                    if (merch_error) {
                        throw merch_error;
                    }
                }
            }

            for (let i = 0; i < selectedCategories.length; i++) {
                const { data: cat, error: cat_error } = await supabase
                    .from("categories_per")
                    .insert([
                        {
                            cat_id: selectedCategories[i],
                            merch_id: merch.id,
                        },
                    ])
                    .select();

                if (cat_error) {
                    throw cat_error;
                }
            }
            console.log("Successful!");
            router.push(
                `${process.env.NEXT_PUBLIC_BASE_URL}/shop/${id}/merchandise`
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div className="card">
            <h1 className="title">Add Merchandise</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />
                </label>

                {/* Description */}
                <label>
                    Description:
                    <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                        className="textarea"
                    />
                </label>

                <label htmlFor="" className="flex flex-col gap-1">
                    Categories
                    <div className="flex gap-2 card">
                        {selectedCategories.map((categoryId) => {
                            const category = options.find(
                                (cat) => cat.id == categoryId
                            );
                            return (
                                <div
                                    key={categoryId}
                                    className="flex items-center card"
                                >
                                    <span>{category?.name}</span>
                                    <button
                                        onClick={() =>
                                            handleRemoveCategory(categoryId)
                                        }
                                        className="ml-2 text-red-500 button-outline"
                                    >
                                        -
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <select
                        name="categories"
                        onChange={handleAddCategory}
                        className="dropdown"
                    >
                        <option value="">Select a category</option>
                        {options.map((category) => {
                            return (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            );
                        })}
                    </select>
                </label>

                {/* Info Picture */}
                <label>
                    Info Picture:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setInfoPicture(e.target.files?.[0] || null)
                        }
                        className="form-input"
                    />
                </label>

                {/* Display Info Picture */}
                {infoPicture && (
                    <div className="my-2 card">
                        <Image
                            src={URL.createObjectURL(infoPicture)}
                            alt="Info Picture"
                            width={100}
                            height={100}
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Merch Pictures */}
                <label>
                    Merch Pictures:
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setMerchPics((prev) => [
                                    ...prev,
                                    ...Array.from(e.target.files),
                                ]);
                                setTimeout(() => {
                                    e.target.value = "";
                                }, 0);
                            }
                        }}
                        className="form-input"
                    />
                </label>

                {/* Display selected merch pics as images */}
                {merchPics.length > 0 && (
                    <div className="file-list">
                        <h3 className="text-lg font-medium">
                            Selected Merch Pictures:
                        </h3>
                        <ul className="flex flex-wrap flex-col gap-2">
                            {merchPics.map((file, index) => (
                                <li key={index} className="file-item card">
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        width={100}
                                        height={100}
                                        className="object-contain"
                                    />
                                    <p>{file.name}</p>
                                    <button
                                        type="button"
                                        onClick={() => removeMerchPic(index)}
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Variants */}
                <h3 className="text-lg font-medium">Variants</h3>
                {variants.map((variant, index) => (
                    <div key={index} className="flex flex-col">
                        <label>
                            Variant Name:
                            <input
                                type="text"
                                value={variant.name}
                                onChange={(e) =>
                                    setVariants((prev) =>
                                        prev.map((v, i) =>
                                            i === index
                                                ? { ...v, name: e.target.value }
                                                : v
                                        )
                                    )
                                }
                                className="form-input"
                            />
                        </label>
                        <label>
                            Price:
                            <input
                                type="number"
                                value={variant.price}
                                onChange={(e) =>
                                    setVariants((prev) =>
                                        prev.map((v, i) =>
                                            i === index
                                                ? {
                                                      ...v,
                                                      price: e.target.value,
                                                  }
                                                : v
                                        )
                                    )
                                }
                                className="form-input"
                                required
                            />
                        </label>
                        <label>
                            Variant Picture:
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setVariants((prev) =>
                                        prev.map((v, i) =>
                                            i === index
                                                ? {
                                                      ...v,
                                                      variantPicture:
                                                          e.target.files?.[0] ||
                                                          null,
                                                  }
                                                : v
                                        )
                                    )
                                }
                                className="form-input"
                            />
                        </label>
                        {/* Display variant picture as an image */}
                        {variant.variantPicture && (
                            <Image
                                src={URL.createObjectURL(
                                    variant.variantPicture
                                )}
                                alt={variant.name}
                                width={100}
                                height={100}
                                className="object-cover my-2"
                            />
                        )}
                        {/* Button to remove variant */}
                        <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="remove-button mt-2"
                        >
                            Remove Variant
                        </button>
                    </div>
                ))}

                {/* Button to add another variant */}
                <button type="button" onClick={addVariant} className="button">
                    Add Variant
                </button>

                {/* Submit Button */}
                <button type="submit" className="button mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddMerch;
