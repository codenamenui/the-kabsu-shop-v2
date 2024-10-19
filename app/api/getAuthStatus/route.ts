import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createServerComponentClient({ cookies });
    const { error } = await supabase.auth.getUser();
    if (error) {
        return Response.json(false);
    }
    return Response.json(true);
}
