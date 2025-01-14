import { Heart, Plus, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "react-router";

export default function ProductCard({ product }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  return (
    <div className="relative group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorited(!isFavorited);
        }}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm
          hover:bg-white transition-all duration-300 
          ${isFavorited ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"}`}
      >
        <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
      </button>

      {/* Product Image */}
      <Link 
        to={`/products/${product._id}`}
        className="block overflow-hidden rounded-lg aspect-square mb-4"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          </div>
        </div>

        <Link 
          to={`/products/${product._id}`}
          className="block group-hover:text-blue-600 transition-colors duration-300"
        >
          <h3 className="font-semibold text-gray-900 text-lg leading-snug truncate">
            {product.name}
          </h3>
        </Link>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-900">
              ${product.price}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </div>
            )}
          </div>

          <Form
            action="/cart"
            method="post"
          >
            <input type="hidden" name="productId" value={product._id} />
            <button
              type="submit"
              name="_action"
              value="addCartItem"
              onClick={() => setIsAddedToCart(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${isAddedToCart 
                  ? "bg-green-50 text-green-600" 
                  : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {isAddedToCart ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </Form>
        </div>
      </div>

      {/* Stock Status */}
      {product.stockStatus !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {product.stockStatus < 20
                ? "Low in stock"
                : `${product.stockStatus}% in stock`}
            </p>
            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300
                  ${product.stockStatus < 20 
                    ? "bg-red-500" 
                    : product.stockStatus < 50 
                      ? "bg-yellow-500" 
                      : "bg-green-500"}`}
                style={{ width: `${product.stockStatus}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}