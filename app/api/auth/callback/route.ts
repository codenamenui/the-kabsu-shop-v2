import {
    createRouteHandlerClient,
    createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const codeSupabase = createRouteHandlerClient({ cookies });
        const { error: codeError } =
            await codeSupabase.auth.exchangeCodeForSession(code);
        // Handle error in OAuth exchange
        if (codeError) {
            // Redirect to the login page with an error message
            console.error(codeError);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/login`
            );
        }

        // Fetch the authenticated user
        const supabase = createServerComponentClient({ cookies });
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            console.error(authError.message);
            throw authError;
        }

        const { data, error } = await supabase
            .from("students")
            .select("student_number")
            .single();

        if (data.student_number == null) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/new-profile`
            );
        }

        if (error) {
            console.log(error);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/login`
            );
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    }
    // If no code is present, redirect to login
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
}
