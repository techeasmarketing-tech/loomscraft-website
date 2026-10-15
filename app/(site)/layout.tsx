import "../globals.css";
import Link from "next/link";
import { Provider } from "@/lib/store";
import { getSettings, getCategories } from "@/lib/sanity";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [s, categories] = await Promise.all([getSettings(), getCategories()]);

  return (
    <Provider whatsapp={s.whatsapp}>
      <Header
        phone={s.phone}
        tagline={s.tagline}
        categories={categories}
      />
      <main>{children}</main>
      <CartDrawer />
      <footer>
        <div className="fw">
          <div>
            <h2>LOOMS CRAFTZ</h2>
            <p>{s.about}</p>
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
            <p>{s.hours}</p>
            <div style={{ marginTop: "1rem" }}>
              <Link href="/delivery-information" style={{ display: "block", marginBottom: "0.5rem" }}>
                Delivery Information
              </Link>
              <Link href="/returns-and-exchanges" style={{ display: "block" }}>
                Returns & Exchanges
              </Link>
            </div>
          </div>
        </div>
        <div className="fb">
          <span>© {new Date().getFullYear()} LOOMS Craftz. All rights reserved.</span>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/delivery-information">Delivery</Link>
          <Link href="/returns-and-exchanges">Returns</Link>
        </div>
      </footer>
    </Provider>
  );
}
