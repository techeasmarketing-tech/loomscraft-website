"use client";
import { useEffect, useRef } from "react";
import { useStore, inr } from "@/lib/store";
import SanityImage from "@/components/SanityImage";

export default function CartDrawer() {
  const {
    open,
    setOpen,
    lines,
    total,
    totalMrp,
    totalSavings,
    setQty,
    removeLine,
    order,
    isValidating,
    validationNotice,
    validateCart,
    isOrderReady,
    whatsapp,
  } = useStore();

  const drawerRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) { returnFocusRef.current = document.activeElement as HTMLElement; drawerRef.current?.removeAttribute("inert"); }
    else { drawerRef.current?.setAttribute("inert", ""); returnFocusRef.current?.focus(); }
  }, [open]);

  return (
    <>
      <div
        className={`scrim ${open ? "on" : ""}`}
        onClick={() => setOpen(false)}
      />
      <aside ref={drawerRef} className={`drawer ${open ? "on" : ""}`} aria-hidden={!open}>
        <div className="dh">
          <h2>Your bag</h2>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>

        {validationNotice && (
          <div
            style={{
              padding: "0.8rem 2rem",
              background: "#fffbeb",
              borderBottom: "1px solid #fef3c7",
              fontSize: "0.8rem",
              color: "#92400e",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{validationNotice}</span>
          </div>
        )}

        <div className="dl">
          {lines.length === 0 && (
            <p className="empty">
              Your bag is empty. Add a piece from the collection to start your
              order.
            </p>
          )}
          {lines.map((l: any, i: number) => {
            const hasMrpDiscount = l.mrp && l.mrp > l.price;
            const isOos = l.inStock === false;

            return (
              <div
                className="li"
                key={l.slug + l.size + l.colour}
                style={{ opacity: isOos ? 0.7 : 1 }}
              >
                {l.v.images[0] ? <SanityImage src={l.v.images[0]} alt={`${l.p.name} in ${l.colour}`} width={140} height={175} sizes="70px" /> : <span className="image-placeholder" />}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <b>{l.p.name}</b>
                    <button
                      onClick={() => removeLine(i)}
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--mut)",
                        padding: "0.2rem 0.4rem",
                      }}
                      title="Remove item"
                    >
                      Remove
                    </button>
                  </div>
                  <small>
                    {l.colour} · {l.size} ·{" "}
                    {hasMrpDiscount && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "var(--mut)",
                          marginRight: "0.3rem",
                        }}
                      >
                        {inr(l.mrp)}
                      </span>
                    )}
                    <span style={{ color: "var(--navy)", fontWeight: 500 }}>
                      {inr(l.price)}
                    </span>
                  </small>
                  {l.priceChanged && <span className="price-changed" role="status">Price updated</span>}
                  {isOos && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#b91c1c",
                        marginBottom: "0.4rem",
                      }}
                    >
                      Currently unavailable
                    </span>
                  )}
                  <div className="qty">
                    <button onClick={() => setQty(i, l.qty - 1)}>−</button>
                    <span>{l.qty}</span>
                    <button onClick={() => setQty(i, l.qty + 1)}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <b>{inr(l.price * l.qty)}</b>
                  {hasMrpDiscount && (
                    <small
                      style={{
                        display: "block",
                        textDecoration: "line-through",
                        color: "var(--mut)",
                      }}
                    >
                      {inr(l.mrp * l.qty)}
                    </small>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {lines.length > 0 && (
          <div className="df">
            {totalSavings > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  color: "var(--mut)",
                }}
              >
                <span>Total MRP:</span>
                <span style={{ textDecoration: "line-through" }}>
                  {inr(totalMrp)}
                </span>
              </div>
            )}
            {totalSavings > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  color: "#15803d",
                  fontWeight: 500,
                }}
              >
                <span>Savings:</span>
                <span>− {inr(totalSavings)}</span>
              </div>
            )}
            <div className="tot">
              <span>Total</span>
              <b>{inr(total)}</b>
            </div>
            {whatsapp && lines.some((l) => l.inStock !== false) && lines.length > 0 && <a
              className="btn wa"
              href={order()}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!isOrderReady}
              onClick={(event) => {
                if (!isOrderReady) event.preventDefault();
              }}
              style={{
                opacity: isOrderReady ? 1 : 0.55,
                pointerEvents: isOrderReady ? "auto" : "none",
              }}
            >
              {isValidating
                ? "Verifying cart…"
                : !isOrderReady
                  ? "Verify cart before ordering"
                  : "Order on WhatsApp"}
            </a>}
            {validationNotice && (
              <button
                className="btn ghost dark"
                onClick={() => void validateCart()}
              >
                Retry verification
              </button>
            )}
            <small>
              {isValidating
                ? "Verifying current pricing & stock..."
                : "Your order details open in WhatsApp. We confirm stock, delivery and payment there."}
            </small>
          </div>
        )}
      </aside>
    </>
  );
}
