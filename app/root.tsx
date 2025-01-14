import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  Form,
  data,
} from "react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import stylesheet from "./app.css?url";
import { commitSession, getSession } from "./session.server";
import { getUser } from "./supabase.server";
import { Bell, Menu, Home, LogOut, User, UserPlus } from "lucide-react";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request.headers.get("Cookie"));
  const toastMessage = session.get("toastMessage");

  // if (toastMessage) {
  //   session.unset("toastMessage");
  // }

  let userEmail = null;
  try {
    const user = await getUser(request);
    userEmail = user?.email ?? null;
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  let adminEmail = String(process.env.ADMIN_EMAIL);

  return data({
    toastMessage,
    userEmail,
    adminEmail,
  }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { toastMessage, userEmail, adminEmail } = useLoaderData<typeof loader>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      const { message, type } = toastMessage;
      if (type === "success") toast.success(message);
    }
  }, [toastMessage]);
  console.log({ toastMessage })
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900 text-gray-100">
        <header className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    ShopSmart
                  </span>
                </Link>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Navigation Menu */}
              {isMenuOpen && (
                <nav className="lg:hidden absolute top-16 left-0 w-full bg-gray-900 border-t border-gray-800 p-4">
                  <div className="flex flex-col items-center gap-4">
                    {userEmail ? (
                      <>
                        <Link to="/profile" className="text-gray-300">
                          Profile
                        </Link>
                        {userEmail === adminEmail && (
                          <Link to="/dashboard" className="text-gray-300">
                            Dashboard
                          </Link>
                        )}
                        <Form method="post" action="/logout">
                          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </Form>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Login</span>
                        </Link>
                        <Link
                          to="/signup"
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Sign Up</span>
                        </Link>
                      </>
                    )}
                  </div>
                </nav>
              )}

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {userEmail ? (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{userEmail[0].toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-gray-300">{userEmail}</span>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800">
                      <Bell className="w-5 h-5" />
                    </button>
                    {userEmail === adminEmail ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                        <Link to={"/dashboard"}>Dashboard</Link>
                      </div>
                    ) : null}

                    <Form method="post" action="/logout">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </Form>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>

        <main className="pt-16 min-h-screen">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "bg-gray-800 text-white border border-gray-700",
              duration: 4000,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </main>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: any }) {
  const message = isRouteErrorResponse(error) ? "Oops!" : "Unexpected Error";
  const details =
    error.status === 404
      ? "The requested page could not be found."
      : error.statusText || "Something went wrong.";

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">{message}</h1>
        <p className="text-gray-400">{details}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
