import "../globals.css";
import Link from "next/link";
import Image from "next/image";
import { Provider } from "@/lib/store";
import { getSettings, getCategories, getAllPageSlugs } from "@/lib/sanity";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ScrollProgress from "@/components/ScrollProgress";
// import FloatingContact from "@/components/FloatingContact";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [s, categories, pageSlugs] = await Promise.all([
    getSettings(),
    getCategories(),
    getAllPageSlugs(),
  ]);
  const publishedPages = new Set(pageSlugs);
  const instagram = s.instagram?.trim() || "";
  const instagramHref = instagram
    ? /^https?:\/\//i.test(instagram)
      ? instagram
      : `https://www.instagram.com/${encodeURIComponent(
          instagram.replace(/^@/, "").replace(/\/$/, ""),
        )}/`
    : "";
  const whatsappDigits = s.whatsapp.replace(/\D/g, "");

  return (
    <Provider whatsapp={s.whatsapp}>
      <ScrollProgress />
      <Header
        phone={s.phone}
        tagline={s.tagline}
        brandLine={s.brandTagline}
        categories={categories}
      />
      <main>{children}</main>
      <CartDrawer />
      {/* Temporarily hidden at the client's request; keep for possible reuse.
      <FloatingContact
        phone={s.phone}
        whatsapp={s.whatsapp}
        instagram={s.instagram}
      />
      */}
      <footer>
        <div className="fw">
          <div>
            <Image
              className="foot-logo"
              src="/logo.png"
              alt="Loom Craftz"
              width={940}
              height={672}
              sizes="160px"
            />
            {s.footerTagline && <span className="foot-tag">{s.footerTagline}</span>}
            <p>{s.about}</p>
            {(instagramHref || whatsappDigits) && (
              <nav className="footer-socials" aria-label="Social media">
                {instagramHref && (
                  <a
                    href={instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.6" cy="6.4" r=".7" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                )}
                {whatsappDigits && (
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5Z" />
                      <path d="M9 8.5c.3-.6.7-.5 1-.1l.8 1.3c.2.3.1.6-.2.9l-.5.5c.5 1 1.3 1.8 2.4 2.3l.5-.6c.2-.3.5-.4.8-.2l1.3.7c.4.2.5.6.2 1-.4.6-.9.9-1.6.9-2.7-.2-5.9-3.3-6.1-5.9-.1-.4.5-1.1 1.4-.8Z" />
                    </svg>
                  </a>
                )}
              </nav>
            )}
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/collections">Collections</Link>
            <Link href="/our-craft">Our Craft</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/wishlist">Wishlist</Link>
          </div>
          <div>
            <h4>Customer Care</h4>
            <p>{s.address}</p>
            <p>
              Phone:{" "}
              <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>{s.phone}</a>
            </p>
            <p>
              Email: <a href="mailto:info@loomcraftz.com">info@loomcraftz.com</a>
            </p>
            <Link className="btn footer-cta" href="/contact">Contact us</Link>
            {(publishedPages.has("delivery-information") ||
              publishedPages.has("returns-and-exchanges")) && (
                <div style={{ marginTop: "1rem" }}>
                  {publishedPages.has("delivery-information") && (
                    <Link
                      href="/delivery-information"
                      style={{ display: "block", marginBottom: "0.5rem" }}
                    >
                      Delivery Information
                    </Link>
                  )}
                  {publishedPages.has("returns-and-exchanges") && (
                    <Link
                      href="/returns-and-exchanges"
                      style={{ display: "block" }}
                    >
                      Returns & Exchanges
                    </Link>
                  )}
                </div>
              )}
          </div>
        </div>
        <div className="fb">
          <span>
            © {new Date().getFullYear()} Loom Craftz. All rights reserved.
          </span>
          {publishedPages.has("privacy-policy") && (
            <Link href="/privacy-policy">Privacy Policy</Link>
          )}
          {publishedPages.has("terms") && (
            <Link href="/terms">Terms & Conditions</Link>
          )}
          {publishedPages.has("delivery-information") && (
            <Link href="/delivery-information">Delivery</Link>
          )}
          {publishedPages.has("returns-and-exchanges") && (
            <Link href="/returns-and-exchanges">Returns</Link>
          )}
        </div>
      </footer>
    </Provider>
  );
}