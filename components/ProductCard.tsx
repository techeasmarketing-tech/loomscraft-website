"use client";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/data";
import { useStore, inr } from "@/lib/store";
import Tilt from "./Tilt";

export default function ProductCard({ p }: { p: Product }) {
  const { wish, toggle } = useStore();
  const on = wish.includes(p.slug);
  const [i, setI] = useState(0);
  const v = p.variants[i] || p.variants[0];

  const price = v.price != null && v.price > 0 ? v.price : p.price;
  const mrp = v.mrp != null && v.mrp > 0 ? v.mrp : p.mrp;
  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  return (
    <Tilt>
      <div className="card">
        <Link href={`/product/${p.slug}`} className="imgwrap">
          <img
            src={v.images[0] || "/placeholder.jpg"}
            alt={`${p.name} in ${v.colour}`}
            loading="lazy"
          />
          <span className="sheen" />
          {!v.inStock && <span className="oos">Sold out</span>}
          {hasDiscount && v.inStock && (
            <span
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "0.8rem",
                background: "var(--navy)",
                color: "#ecd9b6",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.3rem 0.6rem",
              }}
            >
              {discountPercent}% OFF
            </span>
          )}
        </Link>
        <button
          className="heart"
          aria-label="Wishlist"
          onClick={() => toggle(p.slug)}
        >
          {on ? "♥" : "♡"}
        </button>
        <div className="cinfo">
          <small>{p.cat}</small>
          <h3>
            <Link href={`/product/${p.slug}`}>{p.name}</Link>
          </h3>
          <div className="sw">
            {p.variants.map((x, j) => (
              <button
                key={x.sku || x.colour + j}
                aria-label={x.colour}
                title={x.colour}
                className={j === i ? "on" : ""}
                style={{ background: x.hex }}
                onMouseEnter={() => setI(j)}
                onClick={() => setI(j)}
              />
            ))}
            <span>{v.colour}</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.6rem" }}>
            <p style={{ margin: 0, fontWeight: 500 }}>{inr(price)}</p>
            {hasDiscount && (
              <span
                style={{
                  fontSize: "0.85rem",
                  textDecoration: "line-through",
                  color: "var(--mut)",
                }}
              >
                {inr(mrp)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Tilt>
  );
}
