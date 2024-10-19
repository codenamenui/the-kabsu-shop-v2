import { NextRequest, NextResponse } from "next/server";
import { profileMiddleware } from "./middleware/middleware";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    if (req.nextUrl.pathname.startsWith("/api")) {
        return res;
    }

    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        // Ensure that the user profile is created
        const profileCreated = await profileMiddleware();

        // If profile is not created and the user is not on /new-profile, redirect to /new-profile
        if (
            !profileCreated &&
            !req.nextUrl.pathname.startsWith("/new-profile")
        ) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/new-profile`
            );
        }
        // If profile is created and the user is already on /new-profile, redirect to the homepage
        if (profileCreated && req.nextUrl.pathname.startsWith("/new-profile")) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/`
            );
        }

        return res;
    }

    if (req.nextUrl.pathname.startsWith("/new-profile")) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    }

    return res;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
