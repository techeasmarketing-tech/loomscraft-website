import CollectionsView from "@/components/CollectionsView";
import { getProducts, getCategories, getOccasions } from "@/lib/sanity";
export const metadata = { title: "Collections | LOOMS Craftz" };
export default async function Page() {
  const [PRODUCTS, CATS, OCC] = await Promise.all([
    getProducts(),
    getCategories(),
    getOccasions(),
  ]);
  return <CollectionsView PRODUCTS={PRODUCTS} CATS={CATS} OCC={OCC} />;
}
