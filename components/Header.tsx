"use client";
import Link from "next/link";
import { useState } from "react";
import { NAV } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Header({
  phone,
  tagline,
  categories,
}: {
  phone: string;
  tagline?: string;
  categories?: string[];
}) {
  const [o, setO] = useState<number | null>(null);
  const [m, setM] = useState(false);
  const { count, setOpen, wish } = useStore();

  // Dynamic navigation: inject live Sanity categories if present
  const dynamicNav = NAV.map((n) => {
    if (n.l === "Bed linen" && categories?.length) {
      return {
        ...n,
        g: [
          {
            t: "By category",
            k: categories.map((c) => [
              c,
              `/collections?category=${encodeURIComponent(c)}`,
            ]),
          },
          ...n.g.slice(1),
        ],
      };
    }
    return n;
  });

  return (
    <header onMouseLeave={() => setO(null)}>
      <div className="top">
        <span>{tagline || "Premium bedsheets, soft sleep, crafted layers"}</span>
        <span>
          <Link href="/our-craft">Our Craft</Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/contact">Contact</Link>
          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>{phone}</a>
        </span>
      </div>
      <div className="bar">
        <Link href="/" className="logo">
          <b>LOOMS</b>
          <i>Craftz</i>
        </Link>
        <div className="icons">
          <button
            onClick={() => setOpen(true)}
            aria-label={`Shopping bag with ${count} items`}
          >
            Bag{count > 0 && <em>{count}</em>}
          </button>
          <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wish.length} items`}
          >
            ♡{wish.length > 0 && <em>{wish.length}</em>}
          </Link>
          <button
            className="burger"
            onClick={() => setM(!m)}
            aria-label="Toggle navigation menu"
            aria-expanded={m}
          >
            {m ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      <nav className="nav" aria-label="Main navigation">
        {dynamicNav.map((n, i) => (
          <button
            key={n.l}
            className={o === i ? "act" : ""}
            onMouseEnter={() => setO(i)}
            onClick={() => setO(o === i ? null : i)}
            aria-expanded={o === i}
          >
            {n.l} <span>⌄</span>
          </button>
        ))}
      </nav>
      {o !== null && (
        <div className="mega">
          <div>
            <p className="mb">{dynamicNav[o].b}</p>
            <div className="mg">
              {dynamicNav[o].g.map((g) => (
                <div key={g.t}>
                  <h4>{g.t}</h4>
                  {g.k.map(([l, h]) => (
                    <Link key={l} href={h} onClick={() => setO(null)}>
                      {l}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mimg">
            <img src={dynamicNav[o].i} alt={dynamicNav[o].l} />
            <p>{dynamicNav[o].b}</p>
          </div>
        </div>
      )}
      {m && (
        <div className="mobile">
          {dynamicNav.map((n) => (
            <details key={n.l}>
              <summary>{n.l}</summary>
              {n.g
                .flatMap((g) => g.k)
                .map(([l, h]) => (
                  <Link key={l} href={h} onClick={() => setM(false)}>
                    {l}
                  </Link>
                ))}
            </details>
          ))}
          <div
            style={{
              padding: "1rem 0",
              borderTop: "1px solid var(--line)",
              marginTop: "0.5rem",
            }}
          >
            <Link
              href="/our-craft"
              onClick={() => setM(false)}
              style={{ display: "block", padding: "0.5rem 0" }}
            >
              Our Craft
            </Link>
            <Link
              href="/faqs"
              onClick={() => setM(false)}
              style={{ display: "block", padding: "0.5rem 0" }}
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              onClick={() => setM(false)}
              style={{ display: "block", padding: "0.5rem 0" }}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
