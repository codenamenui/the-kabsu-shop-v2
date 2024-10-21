"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const Shops = () => {
    const [shops, setShops] = useState([]);
    const [sCount, setSCount] = useState(0);

    useEffect(() => {
        const getShops = async () => {
            const res = await fetch("/api/shop/view-all-store");
            const data = await res.json();
            setShops(data.data);
        };
        getShops();
    }, []);

    return (
        <div className="flex card gap-5">
            {shops &&
                shops.map((shop) => {
                    return (
                        <div key={shop.id} className="shop-card card">
                            <Image
                                width={50}
                                height={50}
                                src={shop.pfp}
                                alt={`${shop.name} logo`}
                                className="shop-image"
                            />
                            <h2>{shop.name}</h2>
                            <p>Contact: {shop.contact}</p>
                            <p>Email: {shop.email}</p>
                            <p>
                                Social Media:{" "}
                                <a
                                    href={`https://${shop.socmed}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {shop.socmed}
                                </a>
                            </p>
                        </div>
                    );
                })}
        </div>
    );
};

export default Shops;
