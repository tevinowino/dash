import { HelpCircle, Search, User } from 'lucide-react';
import { redirect, useLoaderData } from "react-router";
import { getSession } from '~/session.server';
import { getUser } from '~/supabase.server';

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUser(request);

  let userEmail = null;
  try {
    const user = await getUser(request);
    userEmail = user?.email ?? null;
  } catch (error) {
    console.error("Error fetching user:", error);
  }


  if (!user) {
    // Redirect to login if the user isn't authenticated
    return redirect("/login");
  }

  return  userEmail;
};


export default function HelpPage() {
  return (
    <div className="container min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold text-white mb-8">Help Center</h1>

        {/* Search Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <div className="flex items-center gap-4">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <p className="text-lg font-semibold text-white">How do I reset my password?</p>
              <p className="text-sm text-gray-300 mt-2">
                To reset your password, click on the "Forgot Password" link on the login page and follow the instructions sent to your email.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <p className="text-lg font-semibold text-white">How can I update my profile information?</p>
              <p className="text-sm text-gray-300 mt-2">
                You can update your profile information by going to the "Account Settings" section, where you can change your name, email, and other details.
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <p className="text-lg font-semibold text-white">What should I do if I encounter an error?</p>
              <p className="text-sm text-gray-300 mt-2">
                If you encounter an error, try refreshing the page. If the issue persists, please contact our support team using the form below.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Support</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <User className="w-6 h-6 text-blue-400" />
              <p className="text-sm text-gray-300">Our support team is here to help. Feel free to reach out!</p>
            </div>

            <form className="space-y-4 mt-6">
              <div>
                <label className="text-sm text-gray-400">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Your Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Message</label>
                <textarea
                  placeholder="Describe your issue or question"
                  rows={4}
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 p-3 rounded-lg text-white font-semibold hover:bg-blue-500 transition duration-200"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* Helpful Links Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Helpful Links</h2>
          <div className="space-y-4">
            <a
              href="#"
              className="text-blue-400 hover:underline"
            >
              How to Use the Dashboard
            </a>
            <a
              href="#"
              className="text-blue-400 hover:underline"
            >
              Account and Subscription Information
            </a>
            <a
              href="#"
              className="text-blue-400 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-400 hover:underline"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
