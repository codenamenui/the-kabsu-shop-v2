import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("students")
        .select()
        .eq("id", user.id)
        .single();
    return Response.json({ data: data, error: error });
}
