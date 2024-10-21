import Link from "next/link";
import React from "react";

const AdminNavBar = () => {
    return (
        <div>
            <div className="flex w-2/12 items-center h-screen card">
                <div className="flex flex-col gap-6 justify-center text-center">
                    <Link href={"/admin/users"} className="button-outline">
                        View Users
                    </Link>
                    <Link href={"/admin/shops"} className="button-outline">
                        View Shops
                    </Link>
                    <Link href={"/admin/admins"} className="button-outline">
                        View Admins
                    </Link>
                    <Link href={"/admin/categories"} className="button-outline">
                        View Categories
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminNavBar;
