import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function profileMiddleware() {
    // Fetch the authenticated user
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
        console.error(authError.message);
        throw authError;
    }

    const {
        data: { student_number },
    } = await supabase
        .from("students")
        .select("student_number")
        .eq("user_id", user?.id)
        .single();

    if (student_number == null) {
        return false;
    }
    return true;
}
