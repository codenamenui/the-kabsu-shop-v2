"use client";

import React, { useState } from "react";
import Image from "next/image";
import google_logo from "@/assets/google_logo.png";
import { createComponentClient } from "@/utils/supabase/createComponentClient";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const logInGoogle = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createComponentClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
            },
        });

        if (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <form
                onSubmit={logInGoogle}
                className="flex justify-center items-center h-screen"
            >
                <button
                    type="submit"
                    className="button-outline w-4/12 gap-2 px-6 flex justify-center items-center"
                    disabled={isLoading}
                >
                    <Image
                        src={google_logo}
                        alt={"Google logo"}
                        width={25}
                        height={25}
                        className="pb-0.5"
                    />
                    <h5>
                        {isLoading
                            ? "Signing in..."
                            : "Sign in with CVSU Gmail"}
                    </h5>
                </button>
            </form>
        </div>
    );
};

export default Login;
