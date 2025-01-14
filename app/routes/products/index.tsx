import React from "react";
import { Link, type LoaderFunction } from "react-router";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useLoaderData } from "react-router";
import { clientPromise } from "~/db.server";

type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type LoaderData = {
  products: Product[];
};

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
  const client = await clientPromise;
  const db = client.db("Smartshop");
  const products = await db.collection("products").find({}).toArray();

  return { products: JSON.parse(JSON.stringify(products)) };
};

const ProductsPage: React.FC = () => {
  const { products }: LoaderData = useLoaderData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover object-center"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                <div className="flex space-x-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    <Heart size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <ShoppingCart size={20} />
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Star size={20} />
                  </button>
                </div>
              </div>
              <Link
                to={`/products/${product._id}`}
                className="block mt-4 text-center text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
