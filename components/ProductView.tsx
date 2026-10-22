"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/data";
import { useStore, inr, wa as waLink } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import EnquiryForm from "@/components/EnquiryForm";
import SanityImage, { sanityImageUrl } from "@/components/SanityImage";

export default function ProductView({
  p,
  related,
}: {
  p: Product;
  related: Product[];
}) {
  const { add, wish, toggle, whatsapp } = useStore();
  const wa = (t: string) => waLink(t, whatsapp);

  const initialVariantIdx = Math.max(
    0,
    p?.variants.findIndex((v) => v.inStock) ?? 0,
  );
  const [vi, setVi] = useState(initialVariantIdx);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(
    p?.sizes[Math.min(1, (p?.sizes.length || 1) - 1)] || "Standard",
  );
  const [qty, setQty] = useState(1);
  const [showEnquiry, setShowEnquiry] = useState(false);

  const v = p.variants[vi] || p.variants[0];
  const currentPrice = v.price != null && v.price > 0 ? v.price : p.price;
  const currentMrp = v.mrp != null && v.mrp > 0 ? v.mrp : p.mrp;
  const hasDiscount = currentMrp && currentMrp > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
    : 0;

  const currentImage = v.images[img] || v.images[0];
  const mainImage = currentImage ? sanityImageUrl(currentImage, "max") : undefined;

  const rows = [
    ["Category", p.cat],
    ["Colour", v.colour],
    ...(p.fabric ? [["Fabric", p.fabric]] : []),
    ...(p.tc > 0 ? [["Thread count", `${p.tc} TC`]] : []),
    ...(p.sizes?.length ? [["Sizes", p.sizes.join(" / ")]] : []),
    ...(p.care ? [["Care", p.care]] : []),
    ...(v.sku ? [["SKU", v.sku]] : []),
  ];

  return (
    <div className="sec">
      <p className="crumb">
        <Link href="/">Home</Link> /{" "}
        <Link href="/collections">Collections</Link> /{" "}
        <Link href={`/collections?category=${encodeURIComponent(p.cat)}`}>
          {p.cat}
        </Link>
      </p>

      <div className="pdp">
        <div className="pimg">
          {mainImage ? <SanityImage key={currentImage} className="fade" src={mainImage} alt={`${p.name} in ${v.colour}`} width={1000} height={1000} priority sizes="(max-width: 900px) 100vw, 52vw" /> : <div className="image-placeholder main-placeholder" />}
          {v.images.length > 1 && (
            <div className="thumbs">
              {v.images.map((u, k) => (
                <button
                  key={u + k}
                  className={k === img ? "on" : ""}
                  onClick={() => setImg(k)}
                  aria-label={`View image ${k + 1}`}
                >
                  <SanityImage src={u} alt="" width={120} height={120} sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pinfo">
          <small>{p.cat}</small>
          <h1>
            {p.name}, {v.colour}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <p className="price" style={{ margin: 0 }}>
              {inr(currentPrice)}
            </p>
            {hasDiscount && (
              <span
                style={{
                  fontSize: "1.2rem",
                  textDecoration: "line-through",
                  color: "var(--mut)",
                }}
              >
                {inr(currentMrp)}
              </span>
            )}
            {hasDiscount && (
              <span
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--navy)",
                  background: "#ecd9b6",
                  padding: "0.2rem 0.6rem",
                  fontWeight: 500,
                }}
              >
                Save {discountPercent}%
              </span>
            )}
          </div>

          <p>{p.blurb}</p>

          <div className="chips sm">
            <span>Colour: {v.colour}</span>
          </div>

          <div className="sw big">
            {p.variants.map((x, j) => (
              <button
                key={x.sku || x.colour + j}
                aria-label={x.colour}
                title={x.inStock ? x.colour : `${x.colour} (sold out)`}
                className={`${j === vi ? "on" : ""} ${x.inStock ? "" : "out"}`}
                style={{ background: x.hex }}
                onClick={() => {
                  setVi(j);
                  setImg(0);
                }}
              />
            ))}
          </div>

          <div className="chips sm">
            <span>Size</span>
            {p.sizes.map((s) => (
              <button
                key={s}
                className={size === s ? "on" : ""}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="qty big">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {v.inStock ? (
            <>
              <button
                className="btn"
                onClick={() => add(p, size, v.colour, qty, v.sku)}
              >
                Add to bag
              </button>
              {whatsapp && <a
                className="btn wa"
                target="_blank"
                rel="noreferrer"
                href={wa(
                  `Hello LOOMS Craftz, I'd like to order ${qty} x ${p.name}, ${v.colour} (${v.sku}), size ${size}, ${inr(currentPrice * qty)}.`,
                )}
              >
                Order now on WhatsApp
              </a>}
            </>
          ) : whatsapp ? (
            <a
              className="btn wa"
              target="_blank"
              rel="noreferrer"
              href={wa(
                `Hello LOOMS Craftz, is ${p.name} in ${v.colour} (${v.sku}) coming back in stock?`,
              )}
            >
              Sold out: ask about restock
            </a>
          ) : null}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button className="btn ghost dark" onClick={() => toggle(p.slug)}>
              {wish.includes(p.slug) ? "♥ In wishlist" : "♡ Add to wishlist"}
            </button>
            <button
              className="btn ghost dark"
              onClick={() => setShowEnquiry(!showEnquiry)}
            >
              {showEnquiry ? "Close Enquiry Form" : "Enquire About This Piece"}
            </button>
          </div>

          {showEnquiry && (
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                padding: "1.5rem",
                marginTop: "1rem",
              }}
            >
              <h3 style={{ color: "var(--navy)", marginBottom: "0.5rem" }}>
                Send Product Enquiry
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--mut)",
                  marginBottom: "1rem",
                }}
              >
                Have questions about fabric, custom sizes, or bulk requirements?
                Prepare your enquiry here, then continue in WhatsApp to send it.
              </p>
              <EnquiryForm
                productSlug={p.slug}
                productName={p.name}
                variantColour={v.colour}
                variantSku={v.sku}
                onSuccess={() => {}}
              />
            </div>
          )}

          <dl>
            {rows.map(([a, b]) => (
              <div key={a}>
                <dt>{a}</dt>
                <dd>{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <h2 className="st">You may also like</h2>
          <div className="grid">
            {related.map((x) => (
              <ProductCard key={x.slug} p={x} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
