import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function createComponentClient() {
    const supabase = createClientComponentClient();
    return supabase;
}
