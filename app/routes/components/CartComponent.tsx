import { useState } from "react";
import { CreditCard, ShoppingCart, X, Trash2 } from "lucide-react";
import { Form } from "react-router";

interface CartItem {
  _id: string;
  productId: string;
  product: {
    name: string;
    price: string;
    imageUrl: string;
  };
  quantity: number;
}

interface CartComponentProps {
  cartItems: CartItem[];
}

export default function CartComponent({ cartItems: initialCartItems }: CartComponentProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const totalItems = initialCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = initialCartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shippingCost = totalCost > 200 ? 0 : 10; // Free shipping for orders above $100
  const finalTotal = totalCost + shippingCost;

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
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
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
              {initialCartItems.length > 0 ? (
                initialCartItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <div className="text-sm text-gray-500">
                        ${parseFloat(item.product.price).toFixed(2)} each
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <Form method="post" action="/cart">
                          <input type="hidden" name="productId" value={item.productId} />
                          <button
                            name="_action"
                            value="decreaseQuantity"
                            type="submit"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                        </Form>
                        <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                        <Form method="post" action="/cart">
                          <input type="hidden" name="productId" value={item.productId} />
                          <button
                            name="_action"
                            value="increaseQuantity"
                            type="submit"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </Form>
                      </div>
                    </div>
                    <Form action="/cart" method="post">
                      <input type="hidden" name="productId" value={item.productId} />
                      <input type="hidden" name="_action" value="deleteCartItem" />
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-600 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Form>
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

            {/* Total Cost and Shipping */}
            <div className="border-t bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              <button
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={initialCartItems.length === 0}
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
