import { clientPromise } from "~/db.server";
import { commitSession, getSession } from "~/session.server";
import { getUser } from "~/supabase.server";
import { ObjectId } from "mongodb";
import { redirect } from "react-router";

export const action = async ({ request }: { request: Request }) => {
  let session;

  try {
    // Get productId from the form
    const formData = await request.formData();
    const productId = formData.get("productId") as string;

    console.log("Received productId:", productId);

    if (!productId) {
      throw new Error("Product ID is required.");
    }

    // Get user session and details from Supabase
    session = await getSession(request.headers.get("Cookie"));
    const user = await getUser(request);
    const userId = user?.id;

    console.log("User ID from session:", userId);

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    // Fetch product from the database
    const client = await clientPromise;
    const db = client.db("Smartshop");
    const productsCollection = db.collection("products");
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

    console.log("Fetched product:", product);

    if (!product) {
      throw new Error("Product not found.");
    }

    // Get user data from database by supabaseId
    const usersCollection = db.collection("users");
    const userInDb = await usersCollection.findOne({ supabaseId: userId });

    console.log("User data in DB:", userInDb);

    if (!userInDb) {
      throw new Error("User not found in database.");
    }

    // Check if product is already in the cart
    const productExistsInCart = userInDb.cart?.some(item => item._id.toString() === product._id.toString());

    if (productExistsInCart) {
      session.flash("toast", { message: "Product is already in your cart", type: "info" });
      return redirect("/", { headers: { "Set-Cookie": await commitSession(session) } });
    }

    // Add product to user's cart and update the database
    const updatedCart = [...(userInDb.cart || []), product];
    await usersCollection.updateOne({ supabaseId: userId }, { $set: { cart: updatedCart } });

    console.log("Cart updated for user:", updatedCart);

    // Update toaster status and redirect to homepage
    session.flash("toast", { message: "Product added to cart", type: "success" });
    return redirect("/", { headers: { "Set-Cookie": await commitSession(session) } });

  } catch (error) {
    console.error("Error adding product to cart:", error);

    if (session) {
      session.flash("toast", { message: "Failed to add product to cart", type: "error" });
      return redirect("/", { headers: { "Set-Cookie": await commitSession(session) } });
    }

    return redirect("/");
  }
};
