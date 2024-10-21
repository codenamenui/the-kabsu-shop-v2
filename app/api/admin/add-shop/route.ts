import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        // Parse the request body
        const data = await req.formData();

        // Initialize the Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        // Upload the profile picture to Supabase storage
        const { error: storageError } = await supabase.storage
            .from("store-picture")
            .upload(
                `pfp_${data.get("shopName")}.png`,
                data.get("profilePicture")
            );

        // Handle storage error
        if (storageError) {
            console.error("Error uploading image:", storageError.message);
            return new Response(
                JSON.stringify({
                    message: "Image upload failed",
                    error: storageError.message,
                }),
                { status: 500 }
            );
        }

        // Get the public URL of the uploaded image
        const {
            data: { publicUrl },
        } = supabase.storage
            .from("store-picture")
            .getPublicUrl(`pfp_${data.get("shopName")}.png`);

        // Insert the shop details into the 'tbl_shop' table, including the picture URL
        const { data: shop, error: insertError } = await supabase
            .from("shops")
            .insert([
                {
                    name: data.get("shopName"),
                    email: data.get("email"),
                    socmed: data.get("socialMedia"),
                    contact: data.get("contactNumber"),
                    pfp: publicUrl, // Save the image URL to the database
                },
            ])
            .select()
            .single();

        // Handle database insertion error
        if (insertError) {
            console.error(
                "Error inserting shop into database:",
                insertError.message
            );
            return new Response(
                JSON.stringify({
                    message: "Failed to save shop information",
                    error: insertError.message,
                }),
                { status: 500 }
            );
        }

        // Return success response with the inserted shop data
        return new Response(
            JSON.stringify({ message: "Shop created successfully", shop }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}
