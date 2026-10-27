import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";
import { HERO, CRAFT } from "./data";
import type { Product, HomeContent, Settings, Faq, PageDoc } from "./types";

const client = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });

const f = async <T>(
  q: string,
  p: Record<string, unknown> = {},
  live = false,
): Promise<T | null> => {
  try {
    return await client.fetch<T>(q, p, {
      ...(live ? { cache: "no-store" as const } : { next: { tags: ["sanity"], revalidate: 3600 } }),
    });
  } catch (err) {
    console.error("Sanity query error for:", q, err);
    // Do not disguise a CMS outage as an empty catalogue or missing document.
    throw new Error("Sanity content request failed", { cause: err });
  }
 };

export const fetchLive = <T>(q: string, p: Record<string, unknown> = {}) => f<T>(q, p, true);

const imageUrl = (image: any, width: number, fit: "crop" | "max" = "crop") => {
  const assetUrl = typeof image === "string" ? image : image?.asset?.url;
  if (!assetUrl) return undefined;
  const h = fit === "crop" ? Math.round(width * 1.25) : undefined;
  const hotspot = image?.hotspot;
  const crop = image?.crop;
  const dimensions = image?.asset?.dimensions;
  const params = new URLSearchParams({ w: String(width), fit, auto: "format", q: "80" });
  if (h) params.set("h", String(h));
  if (fit === "crop" && crop && dimensions?.width && dimensions?.height) {
    const left = Math.round(crop.left * dimensions.width), top = Math.round(crop.top * dimensions.height);
    const width = Math.round(dimensions.width * (1 - crop.left - crop.right)), height = Math.round(dimensions.height * (1 - crop.top - crop.bottom));
    if (width > 0 && height > 0) params.set("rect", `${left},${top},${width},${height}`);
  }
  if (fit === "crop" && hotspot) { params.set("fp-x", String(hotspot.x)); params.set("fp-y", String(hotspot.y)); params.set("fp-z", String(hotspot.width || 1)); }
  return `${assetUrl}?${params.toString()}`;
};

const PF = `{
  "slug": slug.current,
  name,
  "cat": category->title,
  price,
  mrp,
  fabric,
  "tc": threadCount,
  "sizes": coalesce(sizes, []),
  care,
  "occasion": coalesce(occasions[]->title, []),
  "blurb": description,
  featured,
  "variants": variants[]{
    "colour": colour,
    "hex": hex.hex,
    sku,
    "images": images[]{"asset": asset->{url,"dimensions":metadata.dimensions}, hotspot, crop},
    "inStock": coalesce(inStock, true),
    price,
    mrp
  }
}`;

const clean = (p: any): Product | null => {
  if (!p || !p.slug || !p.cat) return null;
  const basePrice = Number(p.price) || 0;
  const baseMrp =
    p.mrp != null && Number(p.mrp) > 0 ? Number(p.mrp) : undefined;

  const rawVariants = (p.variants || []).filter((v: any) => v?.colour);
  const fallbackImages = rawVariants.flatMap((v: any) => v.images || []);
  const variants = rawVariants
    .map((v: any) => {
      // If variant has no price override, inherit the base product price. Same for MRP.
      const effectivePrice =
        v.price != null && Number(v.price) > 0 ? Number(v.price) : basePrice;
      const effectiveMrp =
        v.mrp != null && Number(v.mrp) > 0 ? Number(v.mrp) : baseMrp;

      return {
        ...v,
        hex: v.hex || "#cccccc",
        images: (v.images?.length ? v.images : fallbackImages).map(
          (image: any) => imageUrl(image, 1200, "crop") || "",
        ),
        price: effectivePrice,
        mrp: effectiveMrp,
      };
    });

  return variants.length
    ? {
        ...p,
        price: basePrice,
        mrp: baseMrp,
        tc: p.tc ?? 0,
        fabric: p.fabric ?? "",
        care: p.care ?? "",
        blurb: p.blurb ?? "",
        featured: Boolean(p.featured),
        variants,
      }
    : null;
};

const ORD = `order(coalesce(featured, false) desc, _createdAt asc)`;

export const getProducts = async (): Promise<Product[]> => {
  const data = await f<any[]>(
    `*[_type=="product" && defined(slug.current)] | ${ORD} ${PF}`,
  );
  return (data || []).map(clean).filter(Boolean) as Product[];
};

export const getProduct = async (slug: string, live = false): Promise<Product | null> => {
  const query = `*[_type=="product" && slug.current==$slug][0] ${PF}`;
  const p = live ? await fetchLive<any>(query, { slug }) : await f<any>(query, { slug });
  return p ? clean(p) : null;
};

export const getCategories = async (): Promise<string[]> =>
  ((await f<{ title: string }[]>(
    `*[_type=="category"] | order(order asc){title}`,
  )) || []).map((category) => category.title).filter(Boolean);

export const getOccasions = async (): Promise<string[]> =>
  ((await f<{ title: string }[]>(
    `*[_type=="occasion"] | order(order asc){title}`,
  )) || []).map((occasion) => occasion.title).filter(Boolean);

export const getAllProductSlugs = async (): Promise<string[]> =>
  (await f<string[]>(
    `*[_type=="product" && defined(slug.current)].slug.current`,
  )) || [];

export const getAllPageSlugs = async (): Promise<string[]> =>
  (await f<string[]>(
    `*[_type=="page" && defined(slug.current)].slug.current`,
  )) || [];

const SD: Settings = {
  tagline: "Premium bedsheets, soft sleep, crafted layers",
  about:
    "Premium bedsheets, fitted sheets, duvet covers and bedding sets, designed for soft sleep and beautiful bedrooms. Browse online, then order on WhatsApp.",
  phone: "098703 68999",
  whatsapp: "919870368999",
  address: "Noida, Uttar Pradesh 201301",
  hours: "Mon–Sat 10:00 AM – 7:00 PM · Sun 11:00 AM – 5:00 PM",
};

export const getSettings = async (live = false): Promise<Settings> => {
  const query = `*[_id=="siteSettings"][0]{tagline,about,phone,whatsapp,address,hours}`;
  const data = live ? await fetchLive<any>(query) : await f<any>(query);
  const defined = Object.fromEntries(
    Object.entries(data || {}).filter(([, v]) => v),
  );
  return {
    ...SD,
    ...defined,
  };
};

const HD: HomeContent = {
  kicker: "Bed linen, soft craft",
  headline1: "Soft layers.",
  headline2: "Thoughtful craft.",
  subtext:
    "LOOMS Craftz makes bedsheets and bedding that feel as good as they look: deep-pocket fits, calm colours and finishes made for real sleep.",
  craftTitle: "Fabric you can feel, finish you can trust.",
  craftText:
    "Every sheet is cut for deep mattresses, stitched with strong elastic and washed for softness before it reaches your bed. We keep the colours calm so your bedroom can be too.",
  testimonials: [],
};

export const getHome = async (): Promise<HomeContent> => {
  const h =
    (await f<any>(
      `*[_id=="homePage"][0]{kicker,headline1,headline2,subtext,craftTitle,craftText,"heroImage":heroImage{"asset":asset->{url,"dimensions":metadata.dimensions},hotspot,crop},"craftImage":craftImage{"asset":asset->{url,"dimensions":metadata.dimensions},hotspot,crop},"testimonials":coalesce(testimonials,[])}`,
    )) || {};
  const defined = Object.fromEntries(
    Object.entries(h).filter(([, v]) => v != null),
  );
  return {
    ...HD,
    ...defined,
    heroImage: imageUrl(h.heroImage, 2000, "max") || HERO,
    craftImage: imageUrl(h.craftImage, 1200, "crop") || CRAFT,
    testimonials: h.testimonials || [],
  } as HomeContent;
};

export const getFaqs = async (): Promise<Faq[]> =>
  (await f<Faq[]>(`*[_type=="faq"] | order(order asc) {question,answer}`)) || [];

export const getPage = async (slug: string): Promise<PageDoc | null> =>
  f<PageDoc | null>(`*[_type=="page" && slug.current==$slug][0]{title,body}`, {
    slug,
  });
