import { Heart, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "react-router";

export default function ProductCard({ product }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsFavorited(!isFavorited);
        }}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isFavorited ? "text-red-500" : "text-gray-600"}`}
      >
        <Heart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      </Link>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>

        <Link to={`/products/${product._id}`} className="block">
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-xl font-bold text-gray-900">${product.price}</div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </div>
            )}
          </div>

          <Form
            action="/cart"
            method="post"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            {/* Add productId to the form */}
            <input type="hidden" name="productId" value={product._id} />

            <button
              type="submit"
              onClick={() => setIsAddedToCart(true)} // Mark as added to cart
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isAddedToCart ? "Added" : "Add to Cart"}
            </button>
          </Form>
        </div>
      </div>

      {/* Stock Status */}
      {product.stockStatus !== undefined && (
        <p className="text-sm text-gray-500 mt-2">
          {product.stockStatus < 20
            ? "Low in stock"
            : `${product.stockStatus}% in stock`}
        </p>
      )}
    </div>
  );
}
