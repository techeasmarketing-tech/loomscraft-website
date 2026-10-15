import WishlistView from "@/components/WishlistView";
import { getProducts } from "@/lib/sanity";
export const metadata = { title: "Wishlist" };
export default async function Page() {
  return <WishlistView products={await getProducts()} />;
}
