import { cookies } from "next/headers";
import React from "react";
import Link from "next/link";

const Shops = async () => {
    const cookieStore = cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/view-shop`,
        {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );
    const { data } = await (await res).json();
    console.log(data);
    return (
        <div>
            <div className="flex flex-col h-screen justify-center align-center">
                <Link className="button-outline" href="/admin/shops/add">
                    Add Store
                </Link>
            </div>
        </div>
    );
};

export default Shops;
