import { Cormorant_Garamond, Jost } from "next/font/google";
import type { Metadata } from "next";

const d = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--d",
  display: "swap",
});

const b = Jost({
  subsets: ["latin"],
  variable: "--b",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://loomscraftz.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LOOMS Craftz | Premium Bedsheets & Bed Linen",
    template: "%s | LOOMS Craftz",
  },
  description:
    "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep. Browse collections and order directly on WhatsApp.",
  keywords: [
    "bedsheets",
    "cotton sateen",
    "fitted sheets",
    "duvet covers",
    "luxury bedding",
    "LOOMS Craftz",
  ],
  authors: [{ name: "LOOMS Craftz" }],
  creator: "LOOMS Craftz",
  publisher: "LOOMS Craftz",
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "LOOMS Craftz",
    title: "LOOMS Craftz | Premium Bedsheets & Bed Linen",
    description:
      "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep. Browse collections and order directly on WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOOMS Craftz | Premium Bedsheets & Bed Linen",
    description:
      "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${d.variable} ${b.variable}`}>
      <body>{children}</body>
    </html>
  );
}
