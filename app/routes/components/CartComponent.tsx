import { useState, useEffect } from "react";
import { CreditCard, ShoppingCart, X, Trash2 } from "lucide-react";

export default function CartComponent({ cartItems: initialCartItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});

  // Initialize cart items with quantities
  useEffect(() => {
    const initialQuantities = {};
    initialCartItems.forEach(item => {
      initialQuantities[item._id] = 1;
    });
    setCartQuantities(initialQuantities);
    setCartItems(initialCartItems);
  }, [initialCartItems]);

  // Calculate totals
  const calculateItemTotal = (item) => {
    return (parseFloat(item.price) * (cartQuantities[item._id] || 0)).toFixed(2);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(calculateItemTotal(item));
  }, 0);

  const shippingFee = subtotal > 100 ? 0 : 10;
  const total = subtotal + shippingFee;

  // Quantity handlers
  const updateQuantity = (itemId, delta) => {
    setCartQuantities(prev => {
      const newQuantity = Math.max(0, (prev[itemId] || 0) + delta);
      if (newQuantity === 0) {
        removeItem(itemId);
        return prev;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const removeItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item._id !== itemId));
    setCartQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });
  };

  // Calculate total items in cart
  const totalItems = Object.values(cartQuantities).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <div className="relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Your Cart ({totalItems} items)</h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <div className="text-sm text-gray-500">
                        ${parseFloat(item.price).toFixed(2)} each
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-gray-900">{cartQuantities[item._id] || 0}</span>
                        <button
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-medium text-gray-900">
                        ${calculateItemTotal(item)}
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg">Your cart is empty</p>
                  <p className="text-sm mt-2">Add some items to get started!</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Shipping</span>
                <span>${shippingFee.toFixed(2)}</span>
                {shippingFee > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Free shipping over $100)
                  </span>
                )}
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cartItems.length === 0}
              >
                <CreditCard className="w-5 h-5" />
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}