import { cookies } from "next/headers";
import React from "react";
import { handleAdd } from "./actions";

const Users = async () => {
    const cookieStore = cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/view-user`,
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

    return (
        <div>
            <div className="flex items-center h-screen gap-2">
                {data.map(
                    (user: {
                        id: string;
                        first_name: string;
                        last_name: string;
                        middle_name: string;
                        email: string;
                        college: string;
                        program: string;
                        year_level: string;
                        student_number: string;
                    }) => {
                        return (
                            <div
                                key={user.id}
                                className="card flex flex-col gap-2"
                            >
                                <div>{user.id}</div>
                                <div>
                                    {user.first_name} {user.middle_name}{" "}
                                    {user.last_name}
                                </div>
                                <form action={handleAdd}>
                                    <button
                                        type="submit"
                                        name="id"
                                        value={user.id}
                                        className="button-outline"
                                    >
                                        +
                                    </button>
                                </form>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default Users;
