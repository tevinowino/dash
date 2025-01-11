import { Menu, Home, ShoppingCart, Users, BarChart2, Settings, HelpCircle } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useState } from "react";

export default function EcommerceDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { icon: <Home size={20} />, text: "Overview", to: "/dashboard" },
    { icon: <ShoppingCart size={20} />, text: "Products", to: "/dashboard/products" },
    { icon: <Users size={20} />, text: "Customers", to: "/dashboard/customers" },
    { icon: <BarChart2 size={20} />, text: "Analytics", to: "/dashboard/analytics" },
    { icon: <ShoppingCart size={20} />, text: "Orders", to: "/dashboard/orders" },
    { icon: <Settings size={20} />, text: "Settings", to: "/dashboard/settings" },
    { icon: <HelpCircle size={20} />, text: "Help", to: "/dashboard/help" },
  ];

  const handleSidebarToggle = () => {
    setIsOpen((prev) => !prev);
    console.log("Sidebar state:", !isOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="flex items-center gap-6 p-5 bg-gray-800 border-b border-gray-700">
        <Menu
          onClick={handleSidebarToggle}
          className="w-6 h-6 text-blue-400 hover:text-blue-300 cursor-pointer"
          aria-label="Toggle Sidebar"
        />
        <h1 className="text-xl font-bold text-white">E-Commerce Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="flex">
        {/* Sidebar */}
        <section
          className={`h-screen w-64 bg-gray-800 border-r border-gray-700 overflow-hidden transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-64"
          } lg:translate-x-0`}
        >
          <div className="flex flex-col gap-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                {link.icon}
                <span className="font-medium">{link.text}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Main Content Area */}
        <section className="flex-1 p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
