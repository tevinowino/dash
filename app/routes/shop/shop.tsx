import { Outlet, useLoaderData } from "react-router";
import Header from "../components/Header";
import { clientPromise } from "~/db.server";
import { getSession } from "~/session.server";
import { getUser } from "~/supabase.server";
import { ObjectId } from "mongodb";

export const loader = async ({ request }: { request: Request }) => {
    const client = await clientPromise;
    const db = client.db("Smartshop");

    // Extract search parameters for category filtering
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    // Retrieve all products from the database
    const products = await db.collection("products").find({}).toArray();

    // Extract unique categories from products
    const categories = Array.from(new Set(products.map(product => product.category)));

    // Get user data
    const session = await getSession(request.headers.get("Cookie"));
    const user = await getUser(request);

    let cartItemsResults = [];

    if (user) {
        const userId = user.id;

        // Get cart items for the user
        const userFromDb = await db.collection("users").findOne({ supabaseId: userId });

        if (userFromDb) {
            const cart = userFromDb.cart || [];

            // Fetch product details for items in the cart using productId
            const productIds = cart.map(item => new ObjectId(item.productId));
            const cartProducts = await db.collection("products")
                .find({ _id: { $in: productIds } })
                .toArray();

            // console.log({cartProducts})

            // Map product details and quantities together
            cartItemsResults = cart.map(cartItem => {
                const product = cartProducts.find(p => p._id.toString() === cartItem.productId);
                return product
                    ? { productId: product._id.toString(), quantity: cartItem.quantity, product }
                    : null;
            }).filter(Boolean);
        }
    }

    console.log({ cartItemsResults })

    // Return filtered products, categories, and cart items
    return {
        products: JSON.parse(JSON.stringify(category
            ? products.filter(product => product.category === category)
            : products
        )),
        categories,
        cartItems: cartItemsResults
    };
};


export default function ShopRoot() {
    const { products = [], cartItems = [], categories } = useLoaderData();


    return (
        <>
            <main>
                < Header cartItems={cartItems} />
                <section>
                    < Outlet />
                </section>
            </main>
        </>
    )
}