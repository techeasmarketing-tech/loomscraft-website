"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/data";
type Props = { PRODUCTS: Product[]; CATS: string[]; OCC: string[] };
import ProductCard from "@/components/ProductCard";
function Inner({ PRODUCTS, CATS, OCC }: Props) {
  const COLOURS = Array.from(
    new Set(PRODUCTS.flatMap((p) => p.variants.map((v) => v.colour))),
  );
  const sp = useSearchParams();
  const [cat, setCat] = useState(sp.get("category") || "All");
  const [occ, setOcc] = useState(sp.get("occasion") || "Any");
  const [col, setCol] = useState("Any");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const c = sp.get("category");
    if (c) setCat(c);
    const o = sp.get("occasion");
    if (o) setOcc(o);
  }, [sp]);

  let L = PRODUCTS.filter(
    (p) =>
      (cat === "All" || p.cat === cat) &&
      (occ === "Any" || p.occasion.includes(occ)) &&
      (col === "Any" || p.variants.some((v) => v.colour === col)) &&
      (p.name + p.variants.map((v) => v.colour).join() + p.fabric)
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  if (sort === "featured") L = [...L].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  if (sort === "low") L = [...L].sort((a, b) => a.price - b.price);
  if (sort === "high") L = [...L].sort((a, b) => b.price - a.price);
  return (
    <div className="sec">
      <h1 className="st">Collections</h1>
      <div className="tools">
        <input
          placeholder="Search by name, colour or fabric"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <div className="chips">
        {["All", ...CATS].map((c) => (
          <button
            key={c}
            className={cat === c ? "on" : ""}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="chips sm">
        <span>Occasion</span>
        {["Any", ...OCC].map((c) => (
          <button
            key={c}
            className={occ === c ? "on" : ""}
            onClick={() => setOcc(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="chips sm">
        <span>Colour</span>
        {["Any", ...COLOURS].map((c) => (
          <button
            key={c}
            className={col === c ? "on" : ""}
            onClick={() => setCol(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="count">
        {L.length} {L.length === 1 ? "piece" : "pieces"}
      </p>
      {L.length ? (
        <div className="grid">
          {L.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <p className="empty">
          Nothing matches those filters. Clear the search or choose Any
          occasion.
        </p>
      )}
    </div>
  );
}
export default function CollectionsView(props: Props) {
  return (
    <Suspense>
      <Inner {...props} />
    </Suspense>
  );
}
