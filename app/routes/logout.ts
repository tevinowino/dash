import { redirect } from "react-router";
import { createClient } from "~/supabase.server";
import type { Route } from "../+types/root";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";

export async function action ({request}: Route.ActionArgs) {
    let {supabase, headers} = createClient(request);
    let {error} = await supabase.auth.signOut();

    if (error) {
        throw error
    }
    let session = await getSession(request.headers.get('Cookie'))
    
    setSuccessMessage(session, "Logged Out successfully");
        let allHeaders = {
          ...Object.fromEntries(headers.entries()),
          "Set-Cookie": await commitSession(session),
        };
    

    return redirect("/login", { headers: allHeaders });
}