import { cookies } from "next/headers";
import React from "react";

const Admins = async () => {
    const cookieStore = cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/view-admin`,
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
    return <div>Admins</div>;
};

export default Admins;
