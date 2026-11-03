"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/collections" },
  { label: "Our Craft", href: "/our-craft" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact" },
] as const;

function isActiveLink(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/collections") {
    return (
      pathname === href ||
      pathname.startsWith(`${href}/`) ||
      pathname.startsWith("/product/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

// phone, tagline and categories are accepted (and ignored) so the existing
// <Header ... /> call in app/(site)/layout.tsx keeps compiling unchanged.
type HeaderProps = {
  brandLine?: string;
  phone?: string;
  tagline?: string;
  categories?: unknown;
};

export default function Header({ brandLine }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, setOpen, wish } = useStore();

  // Hysteresis: collapse past 160px, expand only once back under 24px.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 24 : y > 160));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const renderLinks = () =>
    navLinks.map(({ label, href }) => {
      const active = isActiveLink(pathname, href);
      return (
        <Link
          key={href}
          className="nav-link"
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={() => setMobileOpen(false)}
        >
          {label}
        </Link>
      );
    });

  return (
    <header className={scrolled ? "scrolled" : undefined}>
      <div className="bar">
        <Link href="/" className="logo" aria-label="Loom Craftz home">
          <Image
            src="/logo.png"
            alt="Loom Craftz"
            width={256}
            height={319}
            priority
            sizes="(max-width: 900px) 100px, 125px"
          />
          {brandLine && <span className="logo-tag">{brandLine}</span>}
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          {renderLinks()}
        </nav>

        <div className="icons">
          <button
            type="button"
            className="icon-action"
            onClick={() => setOpen(true)}
            aria-label={`Shopping bag with ${count} items`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 8h14l1 13H4L5 8Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            {count > 0 && <span className="count-badge">{count}</span>}
          </button>
          <Link
            className="icon-action"
            href="/wishlist"
            aria-label={`Wishlist with ${wish.length} items`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 8.7c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
            </svg>
            {wish.length > 0 && (
              <span className="count-badge">{wish.length}</span>
            )}
          </Link>
          <button
            className="burger"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <nav
        className={`mobile-nav${mobileOpen ? " open" : ""}`}
        id="mobile-navigation"
        aria-label="Mobile navigation"
      >
        {renderLinks()}
      </nav>
    </header>
  );
}