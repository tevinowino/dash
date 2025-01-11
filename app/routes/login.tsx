import type { Route } from "./+types/login";
import { validateEmail, validatePassword } from "~/validation";
import { createClient } from "~/supabase.server";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export async function action({ request }: Route.ActionArgs) {
  let session = await getSession(request.headers.get("Cookie"));

  let formData = await request.formData();
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  let fieldErrors: FieldError = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  // Return errors if any

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  // Sign up user

  let { supabase, headers } = createClient(request);
  let { data: userData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }

  if (userData) {
    setSuccessMessage(session, "Logged In successfully");
    let allHeaders = {
      ...Object.fromEntries(headers.entries()),
      "Set-Cookie": await commitSession(session),
    };

    throw redirect("/dashboard", {
      headers: allHeaders,
    });
  }
  return null;
}

export default function Login() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        <div className="w-full lg:w-1/2 p-8 sm:p-12">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Log In
              </h1>
              <p className="mt-3 text-gray-600">Welcome back! Please log in to continue.</p>
            </div>

            <Form method="post" className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                    {actionData?.fieldErrors?.email && (
                      <span className="text-sm text-red-500 ml-2" aria-live="polite">
                        {actionData.fieldErrors.email}
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="off"
                    placeholder="Enter your email"
                    className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-shadow outline-none"
                    aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                    {actionData?.fieldErrors?.password && (
                      <span className="text-sm text-red-500 ml-2" aria-live="polite">
                        {actionData.fieldErrors.password}
                      </span>
                    )}
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      autoComplete="off"
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-shadow outline-none pr-12"
                      aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium
                  hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all
                  disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </Form>

            {actionData?.formError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg" role="alert">
                <p className="text-sm text-red-600" aria-live="assertive">
                  {actionData.formError}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block w-1/2">
          <div className="h-full w-full relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-l-2xl" />
            <img
              src="data:image/jpeg;base64,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"
              alt="A person using a computer"
              className="h-full w-full object-cover rounded-l-2xl"
            />
          </div>
        </div>
      </div>
    </main>
  );
}