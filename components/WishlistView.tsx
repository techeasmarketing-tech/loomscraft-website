"use client";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
export default function WishlistView({ products }: { products: Product[] }) {
  const { wish } = useStore();
  const L = products.filter((p) => wish.includes(p.slug));
  return (
    <div className="sec">
      <h1 className="st">Wishlist</h1>
      {L.length ? (
        <div className="grid">
          {L.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <p className="empty">
          No saved pieces yet. Tap the heart on any product, or{" "}
          <Link href="/collections">browse the collection</Link>.
        </p>
      )}
    </div>
  );
}
