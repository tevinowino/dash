import { data, Form, redirect, type ActionFunctionArgs } from "react-router";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import { createClient } from "~/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let email = String(formData.get("email"));

  if (!email) {
    return { error: "Email is required" };
  }
    let {supabase, headers} = createClient(request);
  

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "/update-password"});

  if (error) {
    return { error: error.message };
  }

  setSuccessMessage(session, 'Check your email for the reset link')

  return data({ok:true},{headers: {
    "Set-Cookie": await commitSession(session),
  }});
}

export default function ForgotPassword() {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-center gap-8 min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-6">
      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full lg:w-1/2 max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address below to receive a password reset link.
        </p>
        <Form method="post" className="flex flex-col gap-4">
          <label htmlFor="email" className="text-gray-700 font-medium">
            Email:
          </label>
          <input
            className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-500 focus:outline-none"
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
          >
            Send Reset Link
          </button>
        </Form>
      </div>

    </section>
  );
}
