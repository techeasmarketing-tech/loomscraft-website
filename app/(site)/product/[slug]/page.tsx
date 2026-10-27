import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import { getProduct, getProducts } from "@/lib/sanity";
import { siteUrl } from "@/lib/site-url";


type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return {};

  const mainImage = p.variants[0]?.images[0];
  const title = p.name;
  const description =
    p.blurb || `Shop ${p.name} in premium cotton. Crafted for soft sleep.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/product/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/product/${slug}`,
      siteName: "LOOMS Craftz",
      images: mainImage
        ? [
            {
              url: mainImage,
              width: 1200,
              height: 1200,
              alt: `${p.name} by LOOMS Craftz`,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const [p, all] = await Promise.all([getProduct(slug), getProducts()]);

  if (!p) notFound();

  // Intelligent related products: prefer same category first
  const sameCategory = all.filter((x) => x.slug !== slug && x.cat === p.cat);
  const otherCategories = all.filter(
    (x) => x.slug !== slug && x.cat !== p.cat,
  );
  const related = [...sameCategory, ...otherCategories].slice(0, 4);

  // Schema.org Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.blurb,
    image: p.variants.flatMap((v) => v.images).filter(Boolean),
    sku: p.variants[0]?.sku || p.slug,
    brand: {
      "@type": "Brand",
      name: "LOOMS Craftz",
    },
    offers: p.variants.map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      name: `${p.name} - ${v.colour}`,
      price: v.price ?? p.price,
      priceCurrency: "INR",
      availability:
        v.inStock !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${siteUrl}/product/${p.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductView p={p} related={related} />
    </>
  );
}
