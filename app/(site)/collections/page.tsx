import { Suspense } from "react";
import CollectionsView from "@/components/CollectionsView";
import { getProducts, getCategories, getOccasions } from "@/lib/sanity";
export const metadata = { title: "Collections" };
type Filters = { category?: string; occasion?: string; colour?: string; size?: string; sort?: string };
async function CollectionsContent({ filters }: { filters: Filters }) {
  const [PRODUCTS, CATS, OCC] = await Promise.all([getProducts(), getCategories(), getOccasions()]);
  return <CollectionsView PRODUCTS={PRODUCTS} CATS={CATS} OCC={OCC} initialCategory={filters.category || "All"} initialOccasion={filters.occasion || "Any"} initialColour={filters.colour || "Any"} initialSize={filters.size || "Any"} initialSort={filters.sort || "featured"} />;
}
function CollectionsSkeleton() {
  return <div className="sec" aria-label="Loading collections"><h1 className="st">Collections</h1><div className="grid skeleton-grid" aria-hidden="true">{Array.from({length:4},(_,i)=><div className="card skeleton-card" key={i}><div className="skeleton-image"/><div className="cinfo"><div className="skeleton-line"/><div className="skeleton-line short"/></div></div>)}</div></div>;
}
export default async function Page({ searchParams }: { searchParams: Promise<Filters> }) {
  const filters = await searchParams;
  return <Suspense fallback={<CollectionsSkeleton />}><CollectionsContent filters={filters} /></Suspense>;
}
