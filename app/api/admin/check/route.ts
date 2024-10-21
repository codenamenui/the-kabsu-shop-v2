import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function GET() {
    const authSupabase = createServerComponentClient({ cookies });
    const {
        data: { user },
        error: authError,
    } = await authSupabase.auth.getUser();

    if (authError) {
        console.error(authError);
        return Response.json(false);
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error: selectError } = await supabase
        .from("access_ids")
        .select()
        .eq("id", user.id)
        .single();

    if (selectError || data == null) {
        return Response.json(false);
    } else {
        if (selectError) {
            return Response.json(false);
        }
        return Response.json(true);
    }
}
