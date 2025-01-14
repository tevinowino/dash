import { Form, redirect, useActionData } from "react-router";
import type { Route } from "../+types/root";
import { getSession, commitSession, setSuccessMessage } from "~/session.server";
import { createClient } from "~/supabase.server";

export async function action({ request }: Route.ActionArgs) {
    let session = await getSession(request.headers.get("Cookie"));
    let formData = await request.formData();
    let password = formData.get("password");
    let confirmPassword = formData.get("confirmPassword");

    let { supabase, headers } = createClient(request);

    if (!password || !confirmPassword) {
        return { error: "All fields are required" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const { user, error } = await supabase.auth.updateUser({
        password: String(password),
    });

    if (error) {
        return { error: error.message };
    }
    setSuccessMessage(session, "Password updated successfully");

    return redirect("/", {
        headers: { "Set-Cookie": await commitSession(session) },
    });
}

export default function UpdatePassword() {
    const actionData = useActionData<typeof action>();

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-600 to-red-500 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Update Your Password
                </h2>
                <Form method="post" className="space-y-6">
                    {actionData?.error && (
                        <div className="text-red-600 text-center">
                            {actionData.error}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            New Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-gray-700 font-medium mb-2"
                        >
                            Confirm New Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                    >
                        Update Password
                    </button>
                </Form>
            </div>
        </section>
    );
}
