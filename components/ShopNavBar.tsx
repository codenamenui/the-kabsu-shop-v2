"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const AdminNavBar = () => {
    const { id } = useParams();
    return (
        <div>
            <div className="flex w-1/12 items-center h-screen card">
                <div className="flex flex-col gap-6 justify-center text-center">
                    <Link
                        href={`/shop-manage/${id}/merchandise`}
                        className="button-outline"
                    >
                        View Merchandise
                    </Link>
                    <Link
                        href={`/shop-manage/${id}/add-merchandise`}
                        className="button-outline"
                    >
                        Add Merchandise
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminNavBar;
