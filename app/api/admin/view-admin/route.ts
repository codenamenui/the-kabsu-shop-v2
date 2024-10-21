import { createClient } from "@supabase/supabase-js";

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { data, error } = await supabase
        .from("access_ids")
        .select(
            `
    id, 
    students (
      first_name, last_name, middle_name, email, college, program, year_level, student_number
    )
  `
        )
        .single();
    return Response.json({ data: data, error: error });
}
