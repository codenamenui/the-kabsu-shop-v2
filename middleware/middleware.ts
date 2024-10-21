import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function profileMiddleware() {
    // Fetch the authenticated user
    const supabase = createServerComponentClient({ cookies });
    const { error: authError } = await supabase.auth.getUser();

    if (authError) {
        console.error(authError.message);
        throw authError;
    }

    const { data, error } = await supabase
        .from("students")
        .select("student_number")
        .single();

    if (error) {
        return false;
    }

    if (data.student_number == null) {
        return false;
    }
    return true;
}

export async function apiMiddleware() {
    const authSupabase = createServerComponentClient({ cookies });
    const {
        data: { user },
        error: authError,
    } = await authSupabase.auth.getUser();

    if (!user || authError) {
        console.error(authError);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/login`
        );
    }

    return NextResponse.next();
}

export async function adminMiddleware() {
    const checkPriviliege = async () => {
        const cookieStore = cookies();
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/check`,
            {
                headers: {
                    Cookie: cookieStore.toString(),
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );
        return res;
    };
    const val = checkPriviliege();
    const res = await (await val).json();
    if (!res) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    }
    return NextResponse.next();
}
