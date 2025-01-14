import { clientPromise } from "~/db.server";
import { ObjectId } from "mongodb";
import { useLoaderData, type LoaderFunction } from "react-router";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id || !ObjectId.isValid(id)) {
    throw new Response("Invalid Product ID", { status: 404 });
  }

  const client = await clientPromise;
  const db = client.db("Smartshop");
  const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }

  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
  };
};


export default function ProductPage() {
  const product = useLoaderData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full md:w-1/3 rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <div className="text-2xl font-semibold text-blue-600 mt-4">
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <form method="post" action="/cart">
            <input type="hidden" name="productId" value={product.id} />
            <button
              type="submit"
              name="_action"
              value="addCartItem"
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
