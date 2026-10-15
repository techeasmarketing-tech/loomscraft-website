import { createClient } from "next-sanity";
import { randomUUID } from "node:crypto";
import { PRODUCTS, CATS, OCC, HERO, CRAFT, TESTIMONIALS } from "../lib/data";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) throw new Error("Set SANITY_API_WRITE_TOKEN in .env.local first.");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1dwd2ifa",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});
const cache = new Map<string, string>();
const up = async (url: string) => {
  if (!cache.has(url)) {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    cache.set(
      url,
      (await client.assets.upload("image", buf, { filename: "seed.jpg" }))._id,
    );
  }
  return cache.get(url)!;
};
const img = async (url: string) => ({
  _type: "image",
  _key: randomUUID().slice(0, 8),
  asset: { _type: "reference", _ref: await up(url) },
});
const key = () => randomUUID().slice(0, 8);
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
async function main() {
  for (const [i, t] of CATS.entries())
    await client.createOrReplace({
      _id: `category-${slug(t)}`,
      _type: "category",
      title: t,
      order: (i + 1) * 10,
    });
  for (const [i, t] of OCC.entries())
    await client.createOrReplace({
      _id: `occasion-${slug(t)}`,
      _type: "occasion",
      title: t,
      order: (i + 1) * 10,
    });
  for (const [i, p] of PRODUCTS.entries()) {
    const variants = [];
    for (const v of p.variants)
      variants.push({
        _key: key(),
        _type: "variant",
        colour: v.colour,
        hex: { _type: "color", hex: v.hex },
        sku: v.sku,
        inStock: v.inStock,
        images: await Promise.all(v.images.map(img)),
      });
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      category: { _type: "reference", _ref: `category-${slug(p.cat)}` },
      price: p.price,
      mrp: Math.round(p.price * 1.3),
      description: p.blurb,
      fabric: p.fabric,
      threadCount: p.tc,
      sizes: p.sizes,
      care: p.care,
      featured: i < 4,
      occasions: p.occasion.map((o) => ({
        _type: "reference",
        _key: key(),
        _ref: `occasion-${slug(o)}`,
      })),
      variants,
    });
    console.log("product", p.name);
  }
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    tagline: "Premium bedsheets, soft sleep, crafted layers",
    about:
      "Premium bedsheets, fitted sheets, duvet covers and bedding sets, designed for soft sleep and beautiful bedrooms. Browse online, then order on WhatsApp.",
    phone: "098703 68999",
    whatsapp: "919870368999",
    address: "Noida, Uttar Pradesh 201301",
    hours: "Mon–Sat 10:00 AM – 7:00 PM · Sun 11:00 AM – 5:00 PM",
  });
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    heroImage: await img(HERO),
    craftImage: await img(CRAFT),
    kicker: "Bed linen, soft craft",
    headline1: "Soft layers.",
    headline2: "Thoughtful craft.",
    subtext:
      "LOOMS Craftz makes bedsheets and bedding that feel as good as they look: deep-pocket fits, calm colours and finishes made for real sleep.",
    craftTitle: "Fabric you can feel, finish you can trust.",
    craftText:
      "Every sheet is cut for deep mattresses, stitched with strong elastic and washed for softness before it reaches your bed. We keep the colours calm so your bedroom can be too.",
    testimonials: TESTIMONIALS.map((t) => ({
      _key: key(),
      _type: "testimonial",
      quote: t.quote,
      name: t.name,
      meta: t.meta,
    })),
  });
  const pages = [
    [
      "Our craft",
      "our-craft",
      "LOOMS Craftz began with a simple idea: bedding should feel as good as it looks. We choose long-staple cotton, cut every sheet for deep mattresses and finish seams so they last wash after wash.\n\nOur palette stays calm: navy, charcoal, sage, blush and white, so your bedroom feels like a retreat.",
    ],
    [
      "Delivery information",
      "delivery-information",
      "Orders are carefully inspected, hand-packed, and dispatched from our studio within 24 to 48 business hours of WhatsApp order confirmation.\n\nStandard delivery across metro cities in India typically takes 3 to 5 business days. Other regions take 4 to 7 business days.\n\nTracking information will be shared directly to your WhatsApp as soon as your parcel is with the courier partner.",
    ],
    [
      "Returns and exchanges",
      "returns-and-exchanges",
      "We want you to love your LOOMS Craftz bedding. If an item arrives damaged, flawed, or incorrect, please message us on WhatsApp within 48 hours of delivery with photos so we can replace it immediately.\n\nDue to the intimate and hygiene-sensitive nature of bedding, unwashed items in their original packaging may be exchanged within 7 days of delivery. Custom-tailored sizes and washed items cannot be returned.",
    ],
    [
      "Privacy policy",
      "privacy-policy",
      "We store your bag and wishlist only in your browser local storage. We do not sell or monetize personal customer details. Contact information shared for orders is used solely to coordinate delivery and customer support.",
    ],
    [
      "Terms & Conditions",
      "terms",
      "Prices, specifications, and availability are verified at the time of your WhatsApp conversation. LOOMS Craftz reserves the right to correct any typographical or pricing discrepancies prior to order confirmation.",
    ],
  ];
  for (const [title, s, body] of pages)
    await client.createOrReplace({
      _id: `page-${s}`,
      _type: "page",
      title,
      slug: { _type: "slug", current: s },
      body,
    });
  const faqs = [
    [
      "How do I order?",
      "Add pieces to your bag and tap Order on WhatsApp. We confirm stock, delivery and payment in the chat.",
    ],
    [
      "Do you make custom sizes or bulk orders?",
      "Yes. Message us on WhatsApp with your sizes and quantity.",
    ],
    ["How do I care for my sheets?", "Machine wash cold and tumble dry low."],
  ];
  for (const [i, [question, answer]] of faqs.entries())
    await client.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: "faq",
      question,
      answer,
      order: (i + 1) * 10,
    });
  console.log("Done. Open /studio to see your content.");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
