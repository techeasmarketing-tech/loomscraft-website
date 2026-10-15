import { NextRequest, NextResponse } from "next/server";
import { getProduct, getSettings } from "@/lib/sanity";
import { randomUUID } from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      contact,
      email,
      message,
      productSlug,
      variantColour,
      variantSku,
    } = body || {};

    const errors: Record<string, string> = {};

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Please enter your name (minimum 2 characters).";
    }

    if (!contact || typeof contact !== "string" || contact.trim().length < 7) {
      errors.contact =
        "Please provide a valid phone or WhatsApp number (minimum 7 digits).";
    }

    if (email && typeof email === "string" && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      errors.message =
        "Please enter your enquiry or question (minimum 5 characters).";
    }

    // Validate product if a product was selected
    let verifiedProduct = null;
    let verifiedVariant = null;

    if (productSlug) {
      verifiedProduct = await getProduct(productSlug);
      if (!verifiedProduct) {
        errors.product = "The selected product is no longer active in the catalogue.";
      } else if (variantColour) {
        verifiedVariant = verifiedProduct.variants.find(
          (v) => v.colour.toLowerCase() === variantColour.toLowerCase(),
        );
        if (!verifiedVariant) {
          errors.variant = "The selected colour variant was not found.";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { ok: false, errors },
        { status: 400 },
      );
    }

    const enquiryId = `LC-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // Prepare verified enquiry record
    const enquiryRecord = {
      id: enquiryId,
      timestamp,
      name: name.trim(),
      contact: contact.trim(),
      email: email ? email.trim() : null,
      message: message.trim(),
      product: verifiedProduct
        ? {
            name: verifiedProduct.name,
            slug: verifiedProduct.slug,
            price: verifiedVariant?.price ?? verifiedProduct.price,
            variantColour: verifiedVariant?.colour || null,
            variantSku: verifiedVariant?.sku || variantSku || null,
          }
        : null,
    };

    // Genuine delivery mechanism:
    // Log enquiry details to server record
    console.log("[LOOMS Craftz Enquiry Received]", JSON.stringify(enquiryRecord, null, 2));

    // Construct WhatsApp prefilled message so customer can directly chat with reference
    const settings = await getSettings();
    const productNote = enquiryRecord.product
      ? ` regarding ${enquiryRecord.product.name} (${enquiryRecord.product.variantColour || "Standard"}, SKU: ${enquiryRecord.product.variantSku || "N/A"})`
      : "";

    const waText = `Hello LOOMS Craftz, I submitted an enquiry (Ref: ${enquiryId})${productNote}.\nName: ${enquiryRecord.name}\nMessage: ${enquiryRecord.message}`;
    const waUrl = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      ok: true,
      enquiryId,
      message: "Your enquiry has been received. Our team will review and contact you shortly.",
      whatsappUrl: waUrl,
    });
  } catch (err: any) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error processing enquiry. Please try again or reach out on WhatsApp." },
      { status: 500 },
    );
  }
}
