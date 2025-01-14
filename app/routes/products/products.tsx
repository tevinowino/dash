import { Menu, Home, ShoppingCart, Users, BarChart2, Settings, HelpCircle } from "lucide-react";
import { Link, Outlet } from "react-router";
import { useState } from "react";

export default function EcommerceProjects() {

  return (
    <div>
        <section className="flex-1 p-6">
          <Outlet />
        </section>
    </div>
  );
}
