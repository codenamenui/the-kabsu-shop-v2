import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const data = await req.formData();
    const name = data.get("name");
    const picture = data.get("picture");
    console.log(name);
    if (!name || !picture) {
        return new Response(
            JSON.stringify({ error: "Missing name or picture" }),
            {
                status: 400, // Bad Request if either name or picture is missing
            }
        );
    }

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        const category_url = `category_${name}_${Date.now()}.png`;

        // Upload picture to Supabase storage
        const { error: storageError } = await supabase.storage
            .from("category-picture")
            .upload(category_url, picture);

        if (storageError) {
            return new Response(
                JSON.stringify({ error: storageError.message }),
                {
                    status: 500, // Internal Server Error if there's an issue with file upload
                }
            );
        }

        const { data: publicData } = supabase.storage
            .from("category-picture")
            .getPublicUrl(category_url);

        const pictureUrl = publicData?.publicUrl || "";

        // Insert category into the database
        const { error: insertError } = await supabase
            .from("categories")
            .insert([{ name, picture: pictureUrl }]);

        if (insertError) {
            return new Response(
                JSON.stringify({ error: insertError.message }),
                {
                    status: 500, // Internal Server Error if there's an issue with insertion
                }
            );
        }

        return new Response(
            JSON.stringify({ message: "Category added successfully!" }),
            {
                status: 200, // Success
            }
        );
    } catch (error) {
        console.error(error.message);
        return new Response(
            JSON.stringify({
                error: "Internal server error: " + error.message,
            }),
            {
                status: 500, // General Internal Server Error for unexpected failures
            }
        );
    }
}
