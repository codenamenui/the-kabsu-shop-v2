import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createServerComponentClient({ cookies });
    const { data, error } = await supabase.from("shops").select();

    return Response.json({ data: data, error: error });
}
