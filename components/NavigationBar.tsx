"use client";

import { getAuthStatus } from "@/utils/supabase/getAuthStatus";
import { signOut } from "@/components/actions";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAuth = async () => {
            const data = await getAuthStatus();
            setUser(data);
            setLoading(false);
        };
        getAuth();
    }, []);

    const pathname = usePathname();
    const hideNavRoutes = ["/new-profile"];
    if (hideNavRoutes.includes(pathname)) {
        return <div></div>;
    }

    const handleSignOut = async () => {
        const error = await signOut();
        if (!error) {
            setUser(null);
        }
    };

    return (
        <div className="fixed w-screen flex justify-center items-center gap-5 m-4">
            <div className="relative group">
                <Link href={"/"} className="button-outline">
                    Home
                </Link>
            </div>
            {/* Notifications Button */}
            <div className="relative group">
                <Link
                    href={"/notification"}
                    className="button-outline w-1/12 text-center"
                >
                    Notifications
                </Link>
                <div className="popup-box">
                    {loading ? (
                        <div className="popup-text text-center">Loading...</div>
                    ) : (
                        <div className="popup-text flex flex-col justify-center items-center">
                            {user ? (
                                <p className="popup-text text-center">
                                    No new notifications
                                </p>
                            ) : (
                                <p className="popup-text text-center">
                                    Login to view notification
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Button */}
            <div className="relative group">
                <Link
                    href={"/cart"}
                    className="button-outline w-1/12 text-center"
                >
                    Cart
                </Link>
                <div className="popup-box">
                    {loading ? (
                        <div className="popup-text text-center">Loading...</div>
                    ) : (
                        <div className="popup-text flex flex-col justify-center items-center">
                            {user ? (
                                <p className="popup-text text-center">
                                    Your cart is empty
                                </p>
                            ) : (
                                <p className="popup-text text-center">
                                    Log in to view cart
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Login Button */}
            <div className="relative group">
                <div className="button-outline inline cursor-default">User</div>
                <div className="popup-box">
                    {loading ? (
                        <div className="popup-text text-center">Loading...</div>
                    ) : (
                        <div className="popup-text flex flex-col justify-center items-center">
                            {user ? (
                                <form action={handleSignOut}>
                                    <button className="button">Logout</button>
                                </form>
                            ) : (
                                <Link href={"/login"} className="button">
                                    Login
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
