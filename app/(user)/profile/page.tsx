import { cookies } from "next/headers";
import React from "react";

const ProfilePage = async () => {
    const cookieStore = cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/view-profile`,
        {
            method: "GET",
            headers: {
                Cookie: cookieStore.toString(),
                "Content-Type": "application/json",
            },
            cache: "no-store",
        }
    );
    const user = await res.json();
    console.log(user);
    return <div>ProfilePage</div>;
};

export default ProfilePage;
