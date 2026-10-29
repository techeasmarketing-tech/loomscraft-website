import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/300.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource-variable/jost";
import { siteUrl } from "@/lib/site-url";

const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Loom Craftz | Premium Bedsheets & Bed Linen",
    template: "%s | Loom Craftz",
  },
  description:
    "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep. Browse collections and order directly on WhatsApp.",
  keywords: [
    "bedsheets",
    "cotton sateen",
    "fitted sheets",
    "duvet covers",
    "luxury bedding",
    "Loom Craftz",
  ],
  authors: [{ name: "Loom Craftz" }],
  creator: "Loom Craftz",
  publisher: "Loom Craftz",
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Loom Craftz",
    title: "Loom Craftz | Premium Bedsheets & Bed Linen",
    description:
      "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep. Browse collections and order directly on WhatsApp.",
    images: [{ url: "/logo-on-navy.png", width: 1200, height: 874, alt: "Loom Craftz" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo-on-navy.png"],
    title: "Loom Craftz | Premium Bedsheets & Bed Linen",
    description:
      "Premium bedsheets, fitted sheets, duvet covers and bedding sets, crafted for soft sleep.",
  },
  robots: {
    index: !isPreviewDeployment,
    follow: !isPreviewDeployment,
  },
};

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
