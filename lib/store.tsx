"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import type { Product } from "./data";
import type { CartValidationResponse } from "./types";
import { wa } from "./whatsapp";
export { wa } from "./whatsapp";

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
  add: (p: Product, size: string, colour: string, qty?: number, sku?: string) => void;
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
  isOrderReady: boolean;
};

const C = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useStore must be used within Provider");
  return ctx;
};

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

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
  const [cartRevision, setCartRevision] = useState(0);
  const [validatedRevision, setValidatedRevision] = useState(-1);
  const cartRef = useRef(cart);
  const cartRevisionRef = useRef(cartRevision);
  cartRef.current = cart;
  cartRevisionRef.current = cartRevision;

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
    const currentCart = cartRef.current;
    if (!currentCart.length) {
      setValidationNotice(null);
      return;
    }
    setIsValidating(true);
    const revisionAtStart = cartRevisionRef.current;
    try {
      const res = await fetch("/api/cart/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: currentCart.map(({ slug, size, colour, qty, sku, price }) => ({ slug, size, colour, qty, sku, price })),
        }),
      });

      if (res.ok) {
        const data: CartValidationResponse = await res.json();
        if (cartRevisionRef.current !== revisionAtStart) return;
        const updated: Line[] = data.items.filter((item) => !item.isDeleted).map((item) => ({
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
        setValidatedRevision(revisionAtStart);
        if (data.hasUnavailableItems) {
          setValidationNotice(
            "Some items in your bag are currently out of stock or sold out.",
          );
        } else if (data.hasPriceChanges) {
          setValidationNotice(
            "Item prices have been updated to current catalogue rates.",
          );
        } else {
          setValidationNotice(null);
        }
      } else {
        setValidatedRevision(-1);
        setValidationNotice(
          "We couldn't verify current stock and pricing. Please try again before ordering.",
        );
      }
    } catch (err) {
      console.warn("Cart server validation skipped:", err);
      setValidatedRevision(-1);
      setValidationNotice(
        "We couldn't verify current stock and pricing. Please try again before ordering.",
      );
    } finally {
      setIsValidating(false);
    }
  }, []);

  // Validate on drawer open if cart is not empty
  useEffect(() => {
    if (cart.length === 0) {
      setValidationNotice(null);
      return;
    }
    if (open) void validateCart();
  }, [open, cartRevision, cart.length, validateCart]);

  const add = (p: Product, size: string, colour: string, qty = 1, sku?: string) => {
    const v = p.variants.find((x) => sku && x.sku === sku) || p.variants.find((x) => x.colour.toLowerCase() === colour.toLowerCase()) || p.variants[0];
    if (!v || v.inStock === false || !Number.isInteger(qty) || qty < 1) return;
    const boundedQty = Math.min(99, qty);
    const effectivePrice =
      v.price != null && Number(v.price) > 0 ? Number(v.price) : p.price;
    const effectiveMrp =
      v.mrp != null && Number(v.mrp) > 0 ? Number(v.mrp) : p.mrp;

    setCart((c) => {
      const f = c.find(
        (l) => l.slug === p.slug && l.size === size && (l.sku === v.sku || l.colour.toLowerCase() === v.colour.toLowerCase()),
      );
      return f
        ? c.map((l) =>
            l === f ? { ...l, qty: Math.min(99, l.qty + boundedQty) } : l,
          )
        : [
            ...c,
            {
              slug: p.slug,
              size,
              colour,
              qty: boundedQty,
              name: p.name,
              price: effectivePrice,
              mrp: effectiveMrp,
              sku: v.sku,
              image: v.images[0] || "",
              inStock: v.inStock !== false,
            },
          ];
    });
    setValidationNotice(
      "Your bag changed. Verifying current stock and pricing…",
    );
    setValidatedRevision(-1);
    setCartRevision((revision) => revision + 1);
    setOpen(true);
  };

  const setQty = (i: number, q: number) => {
    setCart((c) =>
      q < 1
        ? c.filter((_, j) => j !== i)
        : c.map((l, j) => (j === i ? { ...l, qty: Math.min(99, q) } : l)),
    );
    setValidationNotice(
      "Your bag changed. Verifying current stock and pricing…",
    );
    setValidatedRevision(-1);
    setCartRevision((revision) => revision + 1);
  };

  const removeLine = (i: number) => {
    setCart((c) => c.filter((_, j) => j !== i));
    setValidationNotice(
      "Your bag changed. Verifying current stock and pricing…",
    );
    setValidatedRevision(-1);
    setCartRevision((revision) => revision + 1);
  };

  const toggle = (s: string) =>
    setWish((w) => (w.includes(s) ? w.filter((x) => x !== s) : [...w, s]));

  const lines = cart.map((l) => ({
    ...l,
    p: { name: l.name, price: l.price, mrp: l.mrp },
    v: { sku: l.sku, images: [l.image] },
  }));

  const purchasableLines = lines.filter((l) => l.inStock !== false);
  const total = purchasableLines.reduce((a, l) => a + l.price * l.qty, 0);
  const totalMrp = purchasableLines.reduce(
    (a, l) => a + (l.mrp && l.mrp > l.price ? l.mrp : l.price) * l.qty,
    0,
  );
  const totalSavings = Math.max(0, totalMrp - total);
  const count = purchasableLines.reduce((a, l) => a + l.qty, 0);
  const isOrderReady =
    purchasableLines.length > 0 &&
    !isValidating &&
    !validationNotice &&
    validatedRevision === cartRevision;

  const order = () => {
    if (!isOrderReady) return "#";
    const list = purchasableLines
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
      `Hello Loom Craftz, I'd like to place an enquiry/order:\n\n${list}\n\nTotal: ${inr(total)}${savingsText}\n\nPlease confirm availability, delivery timelines, and payment options.`,
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
        isOrderReady,
      }}
    >
      {children}
    </C.Provider>
  );
}
