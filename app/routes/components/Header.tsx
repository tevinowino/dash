import { Bell, ChevronDown, Gift, Headphones, Menu, Percent, Search, ShoppingBag, ShoppingCart, Truck, User, X } from "lucide-react";
import { Link } from "react-router";
import CartComponent from "./CartComponent";
import { useState } from "react";

interface Category {
  name: string;
  icon: JSX.Element;
}

interface HeaderProps {
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export default function Header({ cartItems }: HeaderProps) {
  // console.log("Cart Items from header", cartItems);

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(0);

  const categories: Category[] = [
    { name: 'Electronics', icon: <Headphones className="w-4 h-4" /> },
    { name: 'Fashion', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Deals', icon: <Percent className="w-4 h-4" /> },
    { name: 'Gift Cards', icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Free shipping on orders over $50
            </span>
            <span className="hidden md:flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Up to 50% off new arrivals
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/track" className="hover:text-blue-100">Track Order</Link>
            <Link to="/help" className="hover:text-blue-100">Help</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                ShopSmart
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 py-2">
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 space-y-2">
                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          to={`/category/${category.name.toLowerCase()}`}
                          className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          {category.icon}
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to="/deals" className="text-gray-600 hover:text-gray-900">Deals</Link>
                <Link to="/new" className="text-gray-600 hover:text-gray-900">What's New</Link>
              </nav>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-6">
              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-xl">
                <div className="relative w-full">
                  <input
                    type="search"
                    placeholder="Search for products..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-4">
                {/* Mobile Search Toggle */}
                <button
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="w-6 h-6 text-gray-600" />
                </button>

                {/* Cart */}
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full relative"
                  onClick={() => isCartOpen ? setIsCartOpen(false) : setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                {/* Cart Component */}
                  <CartComponent cartItems={cartItems}  />

                {/* User Menu */}
                <div className="hidden md:block relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                    <User className="w-6 h-6 text-gray-600" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-2">
                      <Link to="/account" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">My Account</Link>
                      <Link to="/orders" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Orders</Link>
                      <Link to="/wishlist" className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Wishlist</Link>
                      <hr className="my-2" />
                      <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg">Sign Out</button>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  autoFocus
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-gray-900">Categories</div>
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category.name.toLowerCase()}`}
                    className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link to="/deals" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg">Deals</Link>
              <Link to="/new" className="block text-gray-600 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-lg">What's New</Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
