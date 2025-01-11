import { BarChart, LineChart, PieChart, User } from 'lucide-react';
import { useState } from 'react';
import { redirect } from "react-router";
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



export default function AnalyticsPage() {
  const [data] = useState({
    users: 5200,
    activeUsers: 1200,
    revenue: 34250,
    conversions: 15,
  });

  const trafficSources = [
    { name: 'Organic Search', value: 45 },
    { name: 'Direct', value: 25 },
    { name: 'Referral', value: 15 },
    { name: 'Social Media', value: 10 },
    { name: 'Paid Ads', value: 5 },
  ];

  return (
    <div className="container min-h-screen bg-gray-900">
      <main className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold text-white mb-8">Analytics Dashboard</h1>

        {/* Overview Card Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/50 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-semibold text-white">{data.users}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-900/50 rounded-lg">
                <BarChart className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-semibold text-white">{data.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-900/50 rounded-lg">
                <LineChart className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-2xl font-semibold text-white">${data.revenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-900/50 rounded-lg">
                <PieChart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Conversions</p>
                <p className="text-2xl font-semibold text-white">{data.conversions}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Source Breakdown */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Traffic Sources Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trafficSources.map((source, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">{source.name}</p>
                  <p className="text-lg font-semibold text-white">{source.value}%</p>
                </div>
                <div className="w-full h-2 mt-2 bg-gray-700 rounded-full">
                  <div
                    style={{ width: `${source.value}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Trend</h2>
            <div className="h-60 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
              <p className="text-gray-400">Revenue Trend Chart Placeholder</p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Active Users Trend</h2>
            <div className="h-60 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
              <p className="text-gray-400">Active Users Trend Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <p className="text-sm text-gray-300">New user signed up</p>
                  <span className="ml-auto text-sm text-gray-500">2h ago</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
