import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("signup", "routes/signup.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.ts"),
  route("cart", "routes/cart.ts"),
  route("auth/confirm", "routes/confirm.ts"),
  route("dashboard", "dashboard/dashboard.tsx", [
    index("dashboard/index.tsx"),
    route("customers", "dashboard/customers.tsx"),
    route("analytics", "dashboard/analytics.tsx"),
    route("settings", "dashboard/settings.tsx"),
    route("help", "dashboard/help.tsx"),
    route("orders", "dashboard/orders.tsx"),
    route("products", "dashboard/products.tsx"),

  ])

] satisfies RouteConfig;
