import { NextRequest, NextResponse } from "next/server";
import { getProduct } from "@/lib/sanity";
import type {
  CartItemInput,
  CartValidationItem,
  CartValidationResponse,
} from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawItems: CartItemInput[] = Array.isArray(body?.items)
      ? body.items
      : [];

    const validatedItems: CartValidationItem[] = [];
    let hasUnavailable = false;
    let hasPriceChanges = false;

    for (const item of rawItems) {
      if (!item.slug) continue;
      const product = await getProduct(item.slug);

      if (!product) {
        // Product no longer exists in CMS
        hasUnavailable = true;
        validatedItems.push({
          slug: item.slug,
          size: item.size || "Standard",
          colour: item.colour || "Standard",
          qty: Math.max(1, Number(item.qty) || 1),
          name: "Item no longer available",
          sku: "N/A",
          price: 0,
          mrp: 0,
          image: "",
          inStock: false,
          isDeleted: true,
          priceChanged: false,
        });
        continue;
      }

      const variant =
        product.variants.find((v) => v.colour === item.colour) ||
        product.variants[0];

      const livePrice =
        variant.price != null && Number(variant.price) > 0
          ? Number(variant.price)
          : Number(product.price) || 0;

      const liveMrp =
        variant.mrp != null && Number(variant.mrp) > 0
          ? Number(variant.mrp)
          : product.mrp != null && Number(product.mrp) > 0
            ? Number(product.mrp)
            : undefined;

      const inStock = variant.inStock !== false;
      if (!inStock) {
        hasUnavailable = true;
      }

      validatedItems.push({
        slug: product.slug,
        size: item.size || product.sizes[0] || "Standard",
        colour: variant.colour,
        qty: Math.max(1, Number(item.qty) || 1),
        name: product.name,
        sku: variant.sku || "N/A",
        price: livePrice,
        mrp: liveMrp,
        image: variant.images[0] || "",
        inStock,
        isDeleted: false,
        priceChanged: false,
      });
    }

    const subtotal = validatedItems.reduce(
      (sum, item) => sum + (item.inStock ? item.price * item.qty : 0),
      0,
    );

    const totalMrp = validatedItems.reduce((sum, item) => {
      const unitMrp =
        item.mrp && item.mrp > item.price ? item.mrp : item.price;
      return sum + (item.inStock ? unitMrp * item.qty : 0);
    }, 0);

    const totalSavings = Math.max(0, totalMrp - subtotal);

    const response: CartValidationResponse = {
      items: validatedItems,
      subtotal,
      totalMrp,
      totalSavings,
      hasUnavailableItems: hasUnavailable,
      hasPriceChanges,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Cart validation error:", err);
    return NextResponse.json(
      { error: "Failed to validate cart", details: err?.message },
      { status: 500 },
    );
  }
}
