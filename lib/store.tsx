"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "./data";
import type { CartValidationResponse } from "./types";

export type Line = {
  slug: string;
  size: string;
  colour: string;
  qty: number;
  name: string;
  price: number;
  mrp?: number;
  sku: string;
  image: string;
  inStock?: boolean;
  priceChanged?: boolean;
};

type StoreContextType = {
  lines: (Line & {
    p: { name: string; price: number; mrp?: number };
    v: { sku: string; images: string[] };
  })[];
  total: number;
  totalMrp: number;
  totalSavings: number;
  count: number;
  add: (p: Product, size: string, colour: string, qty?: number) => void;
  setQty: (i: number, q: number) => void;
  removeLine: (i: number) => void;
  wish: string[];
  toggle: (s: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  order: () => string;
  whatsapp: string;
  isValidating: boolean;
  validationNotice: string | null;
  validateCart: () => Promise<void>;
  clearNotice: () => void;
};

const C = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useStore must be used within Provider");
  return ctx;
};

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export const wa = (t: string, num = "") => {
  const digits = num.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(t)}`;
};

export function Provider({
  children,
  whatsapp,
}: {
  children: ReactNode;
  whatsapp: string;
}) {
  const [cart, setCart] = useState<Line[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationNotice, setValidationNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("lc-cart3") || "[]"));
      setWish(JSON.parse(localStorage.getItem("lc-wish") || "[]"));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("lc-cart3", JSON.stringify(cart));
      localStorage.setItem("lc-wish", JSON.stringify(wish));
    }
  }, [cart, wish, ready]);

  const validateCart = useCallback(async () => {
    if (!cart.length) return;
    setIsValidating(true);
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ slug, size, colour, qty }) => ({
            slug,
            size,
            colour,
            qty,
          })),
        }),
      });

      if (res.ok) {
        const data: CartValidationResponse = await res.json();
        const updated: Line[] = data.items.map((item) => ({
          slug: item.slug,
          size: item.size,
          colour: item.colour,
          qty: item.qty,
          name: item.name,
          price: item.price,
          mrp: item.mrp,
          sku: item.sku,
          image: item.image,
          inStock: item.inStock,
          priceChanged: item.priceChanged,
        }));

        setCart(updated);
        if (data.hasUnavailableItems) {
          setValidationNotice(
            "Some items in your bag are currently out of stock or sold out.",
          );
        } else if (data.hasPriceChanges) {
          setValidationNotice(
            "Item prices have been updated to current catalogue rates.",
          );
        }
      }
    } catch (err) {
      console.warn("Cart server validation skipped:", err);
    } finally {
      setIsValidating(false);
    }
  }, [cart]);

  // Validate on drawer open if cart is not empty
  useEffect(() => {
    if (open && cart.length > 0) {
      validateCart();
    }
  }, [open]);

  const add = (p: Product, size: string, colour: string, qty = 1) => {
    const v = p.variants.find((x) => x.colour === colour) || p.variants[0];
    const effectivePrice =
      v.price != null && Number(v.price) > 0 ? Number(v.price) : p.price;
    const effectiveMrp =
      v.mrp != null && Number(v.mrp) > 0 ? Number(v.mrp) : p.mrp;

    setCart((c) => {
      const f = c.find(
        (l) => l.slug === p.slug && l.size === size && l.colour === colour,
      );
      return f
        ? c.map((l) => (l === f ? { ...l, qty: l.qty + qty } : l))
        : [
            ...c,
            {
              slug: p.slug,
              size,
              colour,
              qty,
              name: p.name,
              price: effectivePrice,
              mrp: effectiveMrp,
              sku: v.sku,
              image: v.images[0] || "",
              inStock: v.inStock !== false,
            },
          ];
    });
    setOpen(true);
  };

  const setQty = (i: number, q: number) =>
    setCart((c) =>
      q < 1
        ? c.filter((_, j) => j !== i)
        : c.map((l, j) => (j === i ? { ...l, qty: q } : l)),
    );

  const removeLine = (i: number) =>
    setCart((c) => c.filter((_, j) => j !== i));

  const toggle = (s: string) =>
    setWish((w) => (w.includes(s) ? w.filter((x) => x !== s) : [...w, s]));

  const lines = cart.map((l) => ({
    ...l,
    p: { name: l.name, price: l.price, mrp: l.mrp },
    v: { sku: l.sku, images: [l.image] },
  }));

  const total = lines.reduce((a, l) => a + l.price * l.qty, 0);
  const totalMrp = lines.reduce(
    (a, l) => a + (l.mrp && l.mrp > l.price ? l.mrp : l.price) * l.qty,
    0,
  );
  const totalSavings = Math.max(0, totalMrp - total);
  const count = lines.reduce((a, l) => a + l.qty, 0);

  const order = () => {
    const list = lines
      .map(
        (l, i) =>
          `${i + 1}. ${l.name}, ${l.colour} (${l.sku}), size ${l.size} x ${l.qty} = ${inr(l.price * l.qty)}${l.inStock === false ? " [FLAGGED: Out of stock]" : ""}`,
      )
      .join("\n");

    const savingsText =
      totalSavings > 0
        ? `\nMRP Total: ${inr(totalMrp)}\nYou Save: ${inr(totalSavings)}`
        : "";

    return wa(
      `Hello LOOMS Craftz, I'd like to place an enquiry/order:\n\n${list}\n\nTotal: ${inr(total)}${savingsText}\n\nPlease confirm availability, delivery timelines, and payment options.`,
      whatsapp,
    );
  };

  return (
    <C.Provider
      value={{
        lines,
        total,
        totalMrp,
        totalSavings,
        count,
        add,
        setQty,
        removeLine,
        wish,
        toggle,
        open,
        setOpen,
        order,
        whatsapp,
        isValidating,
        validationNotice,
        validateCart,
        clearNotice: () => setValidationNotice(null),
      }}
    >
      {children}
    </C.Provider>
  );
}
