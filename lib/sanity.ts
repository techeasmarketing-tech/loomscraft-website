import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";
import { HERO, CRAFT } from "./data";
import type { Product, HomeContent, Settings, Faq, PageDoc } from "./types";

const client = createClient({ projectId, dataset, apiVersion, useCdn: false });

const f = async <T>(
  q: string,
  p: Record<string, unknown> = {},
): Promise<T | null> => {
  try {
    return await client.fetch<T>(q, p, {
      next: { tags: ["sanity"], revalidate: 3600 },
    });
  } catch (err) {
    console.error("Sanity query error for:", q, err);
    // Do not disguise a CMS outage as an empty catalogue or missing document.
    throw new Error("Sanity content request failed", { cause: err });
  }
};

const im = (u?: string, w = 1400) =>
  u ? `${u}?w=${w}&auto=format&q=80` : undefined;

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
    "images": images[].asset->url,
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
          (u: string) => im(u, 1200) || u,
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

export const getProduct = async (slug: string): Promise<Product | null> => {
  const p = await f<any>(
    `*[_type=="product" && slug.current==$slug][0] ${PF}`,
    { slug },
  );
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

export const getSettings = async (): Promise<Settings> => {
  const data = await f<any>(
    `*[_id=="siteSettings"][0]{tagline,about,phone,whatsapp,address,hours}`,
  );
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
      `*[_id=="homePage"][0]{kicker,headline1,headline2,subtext,craftTitle,craftText,"heroImage":heroImage.asset->url,"craftImage":craftImage.asset->url,"testimonials":coalesce(testimonials,[])}`,
    )) || {};
  const defined = Object.fromEntries(
    Object.entries(h).filter(([, v]) => v != null),
  );
  return {
    ...HD,
    ...defined,
    heroImage: im(h.heroImage, 2000) || HERO,
    craftImage: im(h.craftImage, 1200) || CRAFT,
    testimonials: h.testimonials || [],
  } as HomeContent;
};

export const getFaqs = async (): Promise<Faq[]> =>
  (await f<Faq[]>(`*[_type=="faq"] | order(order asc) {question,answer}`)) || [];

export const getPage = async (slug: string): Promise<PageDoc | null> =>
  f<PageDoc | null>(`*[_type=="page" && slug.current==$slug][0]{title,body}`, {
    slug,
  });
