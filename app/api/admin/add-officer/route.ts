import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const { id, officers } = await req.json();
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    for (let i = 0; i < officers.length; i++) {
        const { data, error } = await supabase
            .from("officers")
            .insert([{ shop_id: id, student_id: officers[i] }])
            .select();
        if (error) {
            console.error(error);
            return Response.json({ data: data, error: error });
        }
    }
    return Response.json("done");
}
