import { Moon, Sun, Globe, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
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


export default function SettingsPage() {
  // Dummy state for settings
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [isReset, setIsReset] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark', !isDarkMode); // Toggle dark mode on body class
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleResetSettings = () => {
    setIsDarkMode(false);
    setLanguage('English');
    setIsReset(true);
    setTimeout(() => setIsReset(false), 2000); // Show reset confirmation for 2 seconds
  };

  return (
    <div className={`container min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className={`text-3xl font-semibold ${isDarkMode ? 'text-white' : 'text-black'} mb-8`}>
          App Settings
        </h1>

        {/* Theme Settings */}
        <div className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-6 rounded-xl border border-gray-700 mb-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Theme Settings</h2>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-500" />
              )}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-6 rounded-xl border border-gray-700 mb-6`}>
          <h2 className="text-lg font-semibold text-white mb-4">Language Settings</h2>
          <div className="flex items-center gap-6">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Reset to Default */}
        <div className={`bg-${isDarkMode ? 'gray-800' : 'gray-100'} p-6 rounded-xl border border-gray-700`}>
          <h2 className="text-lg font-semibold text-white mb-4">Reset to Default</h2>
          <div className="flex items-center gap-6">
            <button
              onClick={handleResetSettings}
              className="px-6 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              Reset Settings
            </button>
            {isReset && <span className="text-sm text-green-400">Settings reset to default!</span>}
          </div>
        </div>
      </main>
    </div>
  );
}
