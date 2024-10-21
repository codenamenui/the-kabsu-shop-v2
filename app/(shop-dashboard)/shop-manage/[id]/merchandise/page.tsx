import MerchandiseDisplay from "@/components/MerchandiseInfo";
import { cookies } from "next/headers";
import React from "react";

const Merchandise = async () => {
    const cookieStore = cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/view-merch`,
        {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );
    const { data: merchandises } = await (await res).json();

    return (
        <div>
            <MerchandiseDisplay data={merchandises}></MerchandiseDisplay>
        </div>
    );
};

export default Merchandise;
