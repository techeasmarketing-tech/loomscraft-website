import { MetadataRoute } from "next";
import { getAllProductSlugs, getAllPageSlugs } from "@/lib/sanity";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://loomscraftz.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/our-craft`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faqs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/delivery-information`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/returns-and-exchanges`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const [productSlugs, pageSlugs] = await Promise.all([
      getAllProductSlugs(),
      getAllPageSlugs(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
      url: `${siteUrl}/product/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Filter out pages that are already in staticRoutes
    const existingSlugs = new Set([
      "our-craft",
      "faqs",
      "contact",
      "privacy-policy",
      "terms",
      "delivery-information",
      "returns-and-exchanges",
    ]);

    const additionalPageRoutes: MetadataRoute.Sitemap = pageSlugs
      .filter((slug) => !existingSlugs.has(slug))
      .map((slug) => ({
        url: `${siteUrl}/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      }));

    const cmsBackedStaticSlugs = new Set([
      "our-craft",
      "delivery-information",
      "returns-and-exchanges",
      "privacy-policy",
      "terms",
    ]);
    const publishedPages = new Set(pageSlugs);
    const availableStaticRoutes = staticRoutes.filter((route) => {
      const slug = new URL(route.url).pathname.replace(/^\/+|\/+$/g, "");
      return !cmsBackedStaticSlugs.has(slug) || publishedPages.has(slug);
    });

    return [
      ...availableStaticRoutes,
      ...productRoutes,
      ...additionalPageRoutes,
    ];
  } catch (err) {
    console.error("Failed to generate dynamic sitemap routes:", err);
    return staticRoutes.filter((route) => {
      const slug = new URL(route.url).pathname.replace(/^\/+|\/+$/g, "");
      return ![
        "our-craft",
        "delivery-information",
        "returns-and-exchanges",
        "privacy-policy",
        "terms",
      ].includes(slug);
    });
  }
}
