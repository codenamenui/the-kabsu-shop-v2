import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();
    const {
        studNumber,
        fname,
        lname,
        mname,
        college,
        selectedProgram,
        studYear,
    } = body;

    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }
    const { error: databaseError } = await supabase
        .from("students")
        .update([
            {
                student_number: studNumber,
                first_name: fname,
                last_name: lname,
                middle_name: mname,
                college: college,
                program: selectedProgram,
                year_level: studYear,
            },
        ])
        .eq("id", user?.id);

    if (databaseError) {
        return new Response(JSON.stringify({ error: databaseError.message }), {
            headers: {
                "Content-Type": "application/json",
            },
            status: 500,
        });
    }

    return new Response(
        JSON.stringify({
            message: "Profile created successfully",
            status: "ok",
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
            status: 201,
        }
    );
}
