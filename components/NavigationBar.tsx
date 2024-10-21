"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { signOut } from "./actions";

const NavigationBar = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [adminAccess, setAdminAccess] = useState<boolean>(false);
    const [storeHandled, setStoreHandled] = useState([]);

    useEffect(() => {
        const getAuth = async () => {
            const supabase = createClientComponentClient();
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (!error) {
                setUser(user);
            }
        };
        getAuth();

        const checkPriviliege = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/check`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const priv = await res.json();
            setAdminAccess(priv);
        };
        checkPriviliege();

        const getStoreHandled = async () => {
            const supabase = createClientComponentClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { data: shops, error } = await supabase
                .from("officers")
                .select("shops(*)")
                .eq("student_id", user.id);

            if (!error && shops) {
                setStoreHandled(shops);
            }
        };
        getStoreHandled();

        setLoading(false);
    }, []);

    useEffect(() => {}, [user]);

    const pathname = usePathname();
    const hideNavRoutes = ["/new-profile", "/admin"];
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
        <div className="w-screen flex justify-center items-center gap-5 m-4">
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

            {/* User Button */}
            <div className="relative group">
                <div className="button-outline inline cursor-default">User</div>
                <div className="popup-box">
                    {loading ? (
                        <div className="popup-text text-center">Loading...</div>
                    ) : (
                        <div className="popup-text flex flex-col justify-center items-center">
                            {user ? (
                                <div className="flex flex-col justify-center items-center gap-1">
                                    <Link href={"/profile"} className="button">
                                        Profile
                                    </Link>
                                    {adminAccess && (
                                        <Link
                                            href={"/admin"}
                                            className="button"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    {storeHandled &&
                                        storeHandled.map((shop) => {
                                            return (
                                                <Link
                                                    key={shop.shops.id}
                                                    className="button-outline"
                                                    href={`/shop-manage/${shop.shops.id}/dashboard`}
                                                >
                                                    {shop.shops.name}
                                                </Link>
                                            );
                                        })}
                                    <form action={handleSignOut}>
                                        <button className="button">
                                            Logout
                                        </button>
                                    </form>
                                </div>
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
