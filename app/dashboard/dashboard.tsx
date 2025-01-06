import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { NavLink } from "react-router";

export default function Dashboard() {
  let dashboardLinks = [
    {
      path: "/dashboard",
      text: "Dashboard",
      icon: <ChartNoAxesColumnIncreasing />,
    },
  ];
  return (
    <main className="flex">
      <nav className="w-96 bg-zinc-600 min-h-screen">
        <ul>
          <li className="p-2">
            <NavLink
              to="/dashboard"
              className="bg-[#353b45] w-full inline-block p-3 rounded-md"
            >
              Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="w-full">Content</div>
    </main>
  );
}
