import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from("merchandises")
        .select(
            `name, description, info_pic, categories_per(categories(name)), variants(name, price, variant_pic), merchandise_pictures(merch_pic)`
        );
    return Response.json({ data: data, error: error });
}
