import React from "react";
import Image from "next/image";

interface MerchandiseData {
    name: string;
    desc: string;
    info_pic: string;
    categories_per: { categories: { name: string } }[];
    variants: { name: string; price: number; variant_pic: string }[];
    merchandise_pictures: { merch_pic: string }[];
}

interface Props {
    data: MerchandiseData[];
}

const MerchandiseDisplay: React.FC<Props> = ({ data }) => {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="card bg-white w-full md:w-1/3 lg:w-1/4 p-4"
                >
                    <h2 className="title">{item.name}</h2>
                    <p className="mb-2">{item.desc}</p>
                    <Image
                        width={1100}
                        height={1100}
                        src={item.info_pic}
                        alt={`${item.name} info`}
                        className="rounded-lg mb-4"
                    />

                    {/* Categories */}
                    <h3 className="text-xl font-semibold mb-2">Categories:</h3>
                    <ul className="list-disc pl-4">
                        {item.categories_per.map((category, idx) => (
                            <li key={idx} className="mb-1">
                                {category.categories.name}
                            </li>
                        ))}
                    </ul>

                    {/* Variants */}
                    <h3 className="text-xl font-semibold mt-4 mb-2">
                        Variants:
                    </h3>
                    <div className="variants space-y-4">
                        {item.variants.map((variant, idx) => (
                            <div
                                key={idx}
                                className="variant bg-gray-100 p-2 rounded-lg shadow-md"
                            >
                                <p>Name: {variant.name}</p>
                                <p>Price: ${variant.price.toFixed(2)}</p>
                                <Image
                                    width={100}
                                    height={100}
                                    src={variant.variant_pic}
                                    alt={`${variant.name} pic`}
                                    className="rounded"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Merchandise Pictures */}
                    <h3 className="text-xl font-semibold mt-4 mb-2">
                        Merchandise Pictures:
                    </h3>
                    <div className="merch-pictures flex space-x-2">
                        {item.merchandise_pictures.map((pic, idx) => (
                            <Image
                                width={100}
                                height={100}
                                key={idx}
                                src={pic.merch_pic}
                                alt={`${item.name} pic ${idx + 1}`}
                                className="rounded"
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MerchandiseDisplay;
