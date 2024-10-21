import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const { id } = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );
    const { data, error } = await supabase
        .from("access_ids")
        .insert([{ id }])
        .select();
    return Response.json({ data: data, error: error });
}
