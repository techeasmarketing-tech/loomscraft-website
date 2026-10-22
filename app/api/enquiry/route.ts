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

    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 120
    ) {
      errors.name = "Please enter your name (minimum 2 characters).";
    }

    if (
      !contact ||
      typeof contact !== "string" ||
      contact.trim().length < 7 ||
      contact.trim().length > 40
    ) {
      errors.contact =
        "Please provide a valid phone or WhatsApp number (minimum 7 digits).";
    }

    if (email && (typeof email !== "string" || email.trim().length > 254)) {
      errors.email = "Please enter a valid email address.";
    } else if (email && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length < 5 ||
      message.trim().length > 2000
    ) {
      errors.message =
        "Please enter your enquiry or question (minimum 5 characters).";
    }

    // Validate product if a product was selected
    let verifiedProduct = null;
    let verifiedVariant = null;

    if (productSlug) {
      if (typeof productSlug !== "string" || productSlug.length > 120) {
        errors.product = "The selected product is invalid.";
      } else {
        verifiedProduct = await getProduct(productSlug, true);
        if (!verifiedProduct) {
          errors.product =
            "The selected product is no longer active in the catalogue.";
        } else if (variantColour) {
          verifiedVariant = verifiedProduct.variants.find(
            (v) =>
              typeof variantColour === "string" &&
              v.colour.toLowerCase() === variantColour.toLowerCase(),
          );
          if (!verifiedVariant) {
            errors.variant = "The selected colour variant was not found.";
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const enquiryId = `LC-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;
    // Prepare a WhatsApp handoff. This route does not deliver or persist enquiries.
    const enquiryRecord = {
      id: enquiryId,
      name: name.trim(),
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

    // Do not log submitted contact details or message content.
    const settings = await getSettings(true);
    const productNote = enquiryRecord.product
      ? ` regarding ${enquiryRecord.product.name} (${enquiryRecord.product.variantColour || "Standard"}, SKU: ${enquiryRecord.product.variantSku || "N/A"})`
      : "";

    const waText = `Hello LOOMS Craftz, I submitted an enquiry (Ref: ${enquiryId})${productNote}.\nName: ${enquiryRecord.name}\nMessage: ${enquiryRecord.message}`;
    const digits = settings.whatsapp.replace(/\D/g, "");
    const waUrl = digits ? `https://wa.me/${digits}?text=${encodeURIComponent(waText)}` : "";

    return NextResponse.json({
      ok: true,
      enquiryId,
      message:
        "Your enquiry draft is ready. Continue in WhatsApp to send it to LOOMS Craftz.",
      whatsappUrl: waUrl,
    });
  } catch (err) {
    console.error("Enquiry submission error", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Internal server error processing enquiry. Please try again or reach out on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
