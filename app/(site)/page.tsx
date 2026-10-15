import HomeView from "@/components/HomeView";
import { getProducts, getCategories, getHome } from "@/lib/sanity";
export default async function Page() {
  const [products, cats, home] = await Promise.all([
    getProducts(),
    getCategories(),
    getHome(),
  ]);
  return <HomeView products={products} cats={cats} home={home} />;
}
