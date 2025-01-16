import React from "react";
import { Link, type LoaderFunction } from "react-router";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useLoaderData } from "react-router";
import { clientPromise } from "~/db.server";
import ProductCard from "../components/ProductCard";

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
            < ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
