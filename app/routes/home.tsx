import { Link, useLoaderData, useSearchParams } from 'react-router';
import {
  ShoppingCart,
  Truck,
  Shield,
  Clock,
  Star,
  Heart,
  Search,
  Menu,
  ArrowRight,
  X,
  TrendingUp,
  ChevronRight,
  Package,
  Check,
  Plus,
  User,
  Bell,
  ChevronDown,
  Percent,
  Headphones,
  ShoppingBag,
  Gift,
  Trash2,
  Minus,
  CreditCard
} from 'lucide-react';
import type { Route } from '../+types/root';
import { clientPromise } from '~/db.server';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { getSession } from '~/session.server';
import { getUser } from '~/supabase.server';

export const loader = async ({ request }: { request: Request }) => {
  const client = clientPromise;
  const db = client.db("Smartshop");

  // Extract search parameters for category filtering
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  // Retrieve all products from the database
  const products = await db.collection("products").find({}).toArray();

  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(product => product.category)));

  // Filter products by category if provided
  const filteredProducts = category
    ? products.filter(product => product.category === category)
    : products;

  // Get user data
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getUser(request);
  console.log("User:", user);

  let cartItems = [];

  if (user) {
    const userId = user.id;
    console.log("User ID:", userId);

    // Get cart items for the user
    const userFromDb = await db.collection("users").findOne({ supabaseId: userId });
    console.log("User from Db:", userFromDb);

    if (userFromDb) {
      cartItems = userFromDb.cart || [];
    } else {
      console.error("User from db not found");
    }
  }

  return { 
    products: JSON.parse(JSON.stringify(filteredProducts)), 
    categories, 
    cartItems 
  };
};



export function meta({ }: Route.MetaArgs) {
  return [
    { title: "ShopSmart - Your One-Stop Shopping Destination" },
    { name: "description", content: "Discover amazing deals on electronics, fashion, home goods and more." },
  ];
}

export default function Home() {
  const { products = [], cartItems = [], categories } = useLoaderData();
  console.log(products.length)
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategoryChange = (category) => {
    searchParams.set('category', category);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header cartItems={cartItems} />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-900">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#4f46e5,transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#2563eb,transparent_50%)]" />
          </div>

          <div className="container mx-auto px-4 py-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-blue-400 border border-blue-600/20">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">New Collection 2025</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold text-white space-y-3">
                  <span className="block">Discover Your</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Perfect Style
                  </span>
                </h1>

                <p className="text-gray-300 text-lg max-w-lg">
                  Explore our curated collection of premium products with up to 50% off.
                  Quality meets affordability in every purchase.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/collection/new"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors font-medium text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
                  >
                    Shop Now
                    <ChevronRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors font-medium backdrop-blur-sm"
                  >
                    Browse Categories
                    <Package className="w-5 h-5" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                  {[
                    { label: 'Active Users', value: '2M+' },
                    { label: 'Products', value: '10K+' },
                    { label: 'Reviews', value: '50K+' }
                  ].map((stat, index) => (
                    <div key={index}>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Image */}
              <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"
                    alt="Fashion Collection"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Background Decorations */}
                <div className="absolute -inset-4 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Truck className="w-6 h-6 text-blue-600" />,
                  title: "Free Shipping",
                  description: "On orders over $50"
                },
                {
                  icon: <Shield className="w-6 h-6 text-blue-600" />,
                  title: "Secure Payment",
                  description: "100% secure checkout"
                },
                {
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                  title: "Fast Delivery",
                  description: "2-3 business days"
                },
                {
                  icon: <Star className="w-6 h-6 text-blue-600" />,
                  title: "Best Quality",
                  description: "Certified products"
                }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories - Enhanced */}
        <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-gray-600 text-center max-w-2xl">
                Explore our wide range of categories and find exactly what you're looking for
              </p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className="px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300 shadow-sm hover:shadow-md font-medium border border-gray-200 hover:border-transparent"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>


        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-medium mb-4">About Us</h3>
              <p className="text-sm">
                ShopSmart is your one-stop destination for all your shopping needs.
                We offer quality products at competitive prices.
              </p>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-white">Shipping Info</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link to="/track-order" className="hover:text-white">Track Order</Link></li>
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-medium mb-4">Newsletter</h3>
              <p className="text-sm mb-4">Subscribe to get special offers and updates</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 ShopSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}