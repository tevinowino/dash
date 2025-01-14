import { clientPromise } from "~/db.server";
import { commitSession, getSession, setSuccessMessage } from "~/session.server";
import { getUser } from "~/supabase.server";
import { ObjectId } from "mongodb";
import { redirect } from "react-router";

export const action = async ({ request }: { request: Request }) => {
  let session;

  try {
    // Parse form data
    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const actionType = formData.get("_action") as string;

    console.log("Action Type:", actionType);
    console.log("Product ID:", productId);

    if (!productId || !ObjectId.isValid(productId)) {
      throw new Error("Invalid or missing Product ID.");
    }

    // Get session and user information
    session = await getSession(request.headers.get("Cookie"));
    const user = await getUser(request);
    const userId = user?.id;

    if (!userId) {
      throw new Error("User not authenticated.");
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db("Smartshop");
    const usersCollection = db.collection("users");

    // Fetch user data from the database
    const userInDb = await usersCollection.findOne({ supabaseId: userId });
    console.log("User data fetched from DB:", userInDb);

    if (!userInDb) {
      throw new Error("User not found in the database.");
    }

    // Get the user's current cart
    const currentCart = userInDb.cart || [];
    const productIndex = currentCart.findIndex(item => item.productId === productId);
    let updatedCart = [...currentCart];

    console.log("Current Cart:", currentCart);

    switch (actionType) {
      case "addCartItem":
        if (productIndex !== -1) {
          updatedCart[productIndex].quantity += 1;
        } else {
          updatedCart.push({ productId, quantity: 1 });
        }
        console.log("Updated Cart after adding item:", updatedCart);
        setSuccessMessage(session, "Product added to cart successfully.");
        break;

      case "increaseQuantity":
        if (productIndex !== -1) {
          updatedCart[productIndex].quantity += 1;
          setSuccessMessage(session, "Product quantity increased.");
        } else {
          throw new Error("Product not found in cart to increase quantity.");
        }
        break;

      case "decreaseQuantity":
        if (productIndex !== -1) {
          if (updatedCart[productIndex].quantity > 1) {
            updatedCart[productIndex].quantity -= 1;
            setSuccessMessage(session, "Product quantity decreased.");
          } else {
            updatedCart.splice(productIndex, 1);
            setSuccessMessage(session, "Product removed from cart.");
          }
        }
        break;

      case "deleteCartItem":
        if (productIndex !== -1) {
          updatedCart.splice(productIndex, 1);
          setSuccessMessage(session, "Product removed from cart successfully.");
        }
        break;

      default:
        throw new Error("Invalid action.");
    }

    console.log("Final Updated Cart:", updatedCart);

    // Update the cart in the database
    await usersCollection.updateOne(
      { supabaseId: userId },
      { $set: { cart: updatedCart } }
    );

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    console.error("Error handling cart action:", error);

    if (session) {
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    return redirect("/");
  }
};
