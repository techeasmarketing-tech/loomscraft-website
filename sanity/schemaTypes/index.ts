import { defineField, defineType } from "sanity";
const req = (r: any) => r.required();
const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: req }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first",
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "o",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title" } },
});
const occasion = defineType({
  name: "occasion",
  title: "Occasion",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: req }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "o",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title" } },
});
const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: req }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: req,
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "category" }],
      validation: req,
    }),
    defineField({
      name: "price",
      title: "Price (₹)",
      type: "number",
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "mrp",
      title: "Original MRP (₹)",
      description:
        "Optional MRP / compare-at price. Shown struck-through when higher than selling price.",
      type: "number",
      validation: (r) => r.min(0),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "fabric", type: "string" }),
    defineField({ name: "threadCount", title: "Thread count", type: "number" }),
    defineField({
      name: "sizes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      initialValue: ["Double", "Queen", "King"],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "care",
      type: "string",
      initialValue: "Tumble dry low",
    }),
    defineField({
      name: "occasions",
      type: "array",
      of: [{ type: "reference", to: [{ type: "occasion" }] }],
    }),
    defineField({
      name: "featured",
      title: "Show on home page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "variants",
      title: "Colours",
      description: "Add one entry per colour. The first one is the main image.",
      type: "array",
      validation: (r) => r.required().min(1),
      of: [
        {
          type: "object",
          name: "variant",
          fields: [
            defineField({
              name: "colour",
              title: "Colour name",
              type: "string",
              validation: req,
            }),
            defineField({
              name: "hex",
              title: "Swatch colour",
              type: "color",
              options: { disableAlpha: true },
              validation: req,
            }),
            defineField({
              name: "sku",
              title: "SKU",
              type: "string",
              validation: req,
            }),
            defineField({
              name: "price",
              title: "Variant Selling Price (₹)",
              description: "Leave blank to inherit product selling price.",
              type: "number",
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "mrp",
              title: "Variant MRP (₹)",
              description: "Leave blank to inherit product MRP.",
              type: "number",
              validation: (r) => r.min(0),
            }),
            defineField({
              name: "images",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
              validation: (r) => r.required().min(1),
            }),
            defineField({
              name: "inStock",
              title: "In stock",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: { title: "colour", subtitle: "sku", media: "images.0" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "variants.0.images.0",
    },
  },
});
const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "tagline", type: "string" }),
    defineField({
      name: "about",
      title: "Footer description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "phone",
      title: "Phone (as shown)",
      type: "string",
      validation: req,
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp number",
      description:
        "Digits with country code, no + or spaces. Example: 919639999950",
      type: "string",
      validation: (r) =>
        r.required().regex(/^\d{10,15}$/, { name: "digits only" }),
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      description:
        "Instagram handle (e.g. loomscraftz) or full profile link. Leave empty to hide the floating Instagram button.",
      type: "string",
    }),
    defineField({
      name: "brandTagline",
      title: "Navbar tagline",
      description: "Small line shown under the logo in the header.",
      type: "string",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer tagline",
      description: "Small line shown under the logo in the footer.",
      type: "string",
    }),
    defineField({
      name: "founderName",
      title: "Founder story: name",
      description: "Shown on the Our Craft page. Leave empty to use the default draft text.",
      type: "string",
    }),
    defineField({
      name: "founderRole",
      title: "Founder story: role",
      description: "Example: Founder, Loom Craftz",
      type: "string",
    }),
    defineField({
      name: "founderPhoto",
      title: "Founder story: photo",
      description: "Portrait photo works best (4:5).",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "founderQuote",
      title: "Founder story: pull quote",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "founderStory",
      title: "Founder story: text",
      description: "Leave a blank line between paragraphs.",
      type: "text",
      rows: 12,
    }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "hours", title: "Opening hours", type: "string" }),
  ],
});
const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "kicker", title: "Small heading", type: "string" }),
    defineField({
      name: "headline1",
      title: "Headline line 1",
      type: "string",
    }),
    defineField({
      name: "headline2",
      title: "Headline line 2 (italic)",
      type: "string",
    }),
    defineField({ name: "subtext", type: "text", rows: 3 }),
    defineField({
      name: "craftTitle",
      title: "Craft section title",
      type: "string",
    }),
    defineField({
      name: "craftText",
      title: "Craft section text",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "craftImage",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({ name: "quote", type: "text", rows: 3 }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "meta", title: "City", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "quote" } },
        },
      ],
    }),
  ],
});
const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: req }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      description:
        "Used in the web address, e.g. our-craft, privacy-policy, terms",
      validation: req,
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 14,
      description: "Leave a blank line between paragraphs.",
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", type: "string", validation: req }),
    defineField({ name: "answer", type: "text", rows: 3, validation: req }),
    defineField({ name: "order", type: "number", initialValue: 10 }),
  ],
  orderings: [
    { title: "Order", name: "o", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: { select: { title: "question" } },
});
export const schemaTypes = [
  product,
  category,
  occasion,
  siteSettings,
  homePage,
  page,
  faq,
];