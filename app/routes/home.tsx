import { redirect, type LoaderFunction } from "react-router"

export const loader: LoaderFunction = async ({ request }) => {
    console.log("Redirecting to /shop")
return redirect("/shop")
}


