const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

const IMG = [
  U("photo-1631049307264-da0ec9d70304"),
  U("photo-1522771739844-6a9f6d5f14af"),
  U("photo-1540518614846-7eded433c457"),
  U("photo-1505693416388-ac5ce068fe85"),
  U("photo-1584100936595-c0654b55a2e2"),
];

export type Variant = {
  colour: string;
  hex: string;
  sku: string;
  images: string[];
  inStock: boolean;
  price?: number;
  mrp?: number;
};

export type Product = {
  slug: string;
  name: string;
  cat: string;
  price: number;
  mrp?: number;
  fabric: string;
  tc: number;
  sizes: string[];
  care: string;
  occasion: string[];
  blurb: string;
  featured?: boolean;
  variants: Variant[];
};

const V = (
  colour: string,
  hex: string,
  sku: string,
  imgs: number[],
  inStock = true,
): Variant => ({
  colour,
  hex,
  sku,
  images: imgs.map((i) => IMG[i % IMG.length]),
  inStock,
});

const P = (
  name: string,
  cat: string,
  price: number,
  occasion: string[],
  blurb: string,
  variants: Variant[],
  fabric = "Cotton sateen",
  tc = 400,
  sizes = ["Double", "Queen", "King"],
): Product => ({
  slug: name
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, ""),
  name,
  cat,
  price,
  fabric,
  tc,
  sizes,
  care: "Tumble dry low",
  occasion,
  blurb,
  variants,
});

export const PRODUCTS: Product[] = [
  P(
    "Fitted Sheet",
    "Fitted Sheets",
    1899,
    ["Everyday", "Hotel"],
    "Deep pockets and strong elastic. A hotel-dark classic that makes white pillows glow.",
    [
      V("Midnight Navy", "#14284b", "LC-FS-NV", [0, 3]),
      V("Charcoal", "#3b3f46", "LC-FS-CH", [3, 0]),
      V("Sage", "#8c9a7d", "LC-FS-SG", [1, 2], false),
    ],
  ),
  P(
    "Flat Sheet",
    "Flat Sheets",
    1599,
    ["Everyday", "Guest Room"],
    "Breathable and softly washed, made for layering a polished bed.",
    [
      V("Sage", "#8c9a7d", "LC-FL-SG", [1, 2]),
      V("Ivory", "#f1ebdd", "LC-FL-IV", [2, 1]),
      V("Stone", "#b9ad9c", "LC-FL-ST", [4, 1]),
    ],
    "Washed cotton",
    300,
  ),
  P(
    "Complete Sheet Set",
    "Sheet Sets",
    3499,
    ["Hotel", "Gifting"],
    "Fitted sheet, flat sheet and two pillowcases in crisp, hotel-white sateen.",
    [
      V("Cloud White", "#f7f6f2", "LC-SS-WH", [2, 4]),
      V("Midnight Navy", "#14284b", "LC-SS-NV", [0, 3]),
      V("Blush", "#e5c3bd", "LC-SS-BL", [4, 2]),
    ],
  ),
  P(
    "Duvet Cover",
    "Duvet Covers",
    2799,
    ["Everyday", "Hotel"],
    "A calm duvet cover with a hidden button closure.",
    [
      V("Slate", "#4b535e", "LC-DC-SL", [3, 0]),
      V("Stone", "#b9ad9c", "LC-DC-ST", [4, 3]),
    ],
    "Cotton percale",
    250,
    ["Double", "Queen", "King"],
  ),
  P(
    "Floral Pillowcases",
    "Pillowcases",
    999,
    ["Wedding", "Gifting"],
    "Pair of soft pillowcases with a delicate floral print.",
    [
      V("Blush Floral", "#e8c9c4", "LC-PC-BF", [4, 2]),
      V("Sage Floral", "#a5b296", "LC-PC-SF", [1, 4]),
    ],
    "Cotton sateen",
    300,
    ["Standard", "King"],
  ),
  P(
    "Kids Playtime Set",
    "Sheet Sets",
    2299,
    ["Kids"],
    "Cheerful prints on easy-care cotton that survives weekly washes.",
    [
      V("Sky Print", "#a9c4de", "LC-KD-SK", [0, 1]),
      V("Sunny Print", "#f0d58a", "LC-KD-SN", [2, 3]),
    ],
    "Cotton",
    220,
    ["Single", "Double"],
  ),
  P(
    "Wedding Gift Set",
    "Sheet Sets",
    4999,
    ["Wedding", "Gifting"],
    "Gift-boxed set with sheets and pillowcases, ready to give.",
    [
      V("Ivory", "#f1ebdd", "LC-WG-IV", [2, 4]),
      V("Champagne", "#d8c39a", "LC-WG-CH", [4, 2]),
    ],
    "Egyptian cotton",
    600,
  ),
];

export const cover = (p: Product) => p.variants[0].images[0];

export const COLOURS = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.variants.map((v) => v.colour))),
);

export const CATS = [
  "Fitted Sheets",
  "Flat Sheets",
  "Sheet Sets",
  "Duvet Covers",
  "Pillowcases",
];

export const OCC = [
  "Everyday",
  "Guest Room",
  "Wedding",
  "Kids",
  "Hotel",
  "Gifting",
];

export const WHY_CHOOSE = [
  {
    title: "Hotel-soft finish",
    text: "Smooth, washed fabric with a premium hand-feel that makes every bed feel elevated.",
    icon: "01",
  },
  {
    title: "Deep-pocket comfort",
    text: "Cut for a snug, secure fit across standard and deeper mattresses without slipping.",
    icon: "02",
  },
  {
    title: "Calm, everyday colours",
    text: "Muted shades and easy neutrals designed for bedrooms that feel restful and effortless.",
    icon: "03",
  },
  {
    title: "Made for real routines",
    text: "Easy-care bedding built to handle weekly washes while staying soft and polished.",
    icon: "04",
  },
];

export const ROOM_STYLES = [
  {
    name: "Everyday calm",
    blurb:
      "Fresh layers for your main bedroom in soft neutrals and warm whites.",
    image: IMG[0],
    href: "/collections?occasion=Everyday",
  },
  {
    name: "Guest room ready",
    blurb: "Polished bedding that feels thoughtfully prepared for every stay.",
    image: IMG[3],
    href: "/collections?occasion=Guest Room",
  },
  {
    name: "Kids' rooms",
    blurb: "Fun, durable colours and easy-care fabrics for busy family beds.",
    image: IMG[1],
    href: "/collections?occasion=Kids",
  },
  {
    name: "Wedding gifting",
    blurb:
      "Gift-worthy sets and soft palettes perfect for a fresh start together.",
    image: IMG[2],
    href: "/collections?occasion=Wedding",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "The fabric feels so premium and the fit is perfect on our bed. It looks like a boutique hotel room at home.",
    name: "Aisha M.",
    meta: "Mumbai",
  },
  {
    quote:
      "We bought a sheet set for our guest room and it instantly made the space feel more finished and welcoming.",
    name: "Rohan S.",
    meta: "Bengaluru",
  },
  {
    quote:
      "The colours are beautiful and calming, and the quality has held up through multiple washes. Truly worth it.",
    name: "Nisha P.",
    meta: "Hyderabad",
  },
];

export const NAV = [
  {
    l: "Collections",
    b: "Curated bedding stories: solids, stripes, florals and soft neutrals.",
    g: [
      {
        t: "Shop looks",
        k: [
          ["All bedding", "/collections"],
          ["Featured", "/collections"],
          ["Solid colours", "/collections"],
          ["Prints & florals", "/collections"],
        ],
      },
    ],
    i: IMG[0],
  },
  {
    l: "Bed Linen",
    b: "Sheets, covers and pillowcases cut for a smooth, hotel-like finish.",
    g: [
      {
        t: "Sheets",
        k: [
          ["Fitted sheets", "/collections?category=Fitted Sheets"],
          ["Flat sheets", "/collections?category=Flat Sheets"],
          ["Complete sheet sets", "/collections?category=Sheet Sets"],
        ],
      },
      {
        t: "Covers",
        k: [
          ["Duvet covers", "/collections?category=Duvet Covers"],
          ["Pillowcases", "/collections?category=Pillowcases"],
        ],
      },
      {
        t: "For every room",
        k: OCC.map((o) => [o, `/collections?occasion=${o}`]),
      },
    ],
    i: IMG[3],
  },
  {
    l: "Sizes",
    b: "Find the right fit for single, double, queen and king beds.",
    g: [
      {
        t: "Bed sizes",
        k: [
          ["Single / Twin", "/collections"],
          ["Double", "/collections"],
          ["Queen", "/collections"],
          ["King", "/collections"],
        ],
      },
    ],
    i: IMG[4],
  },
  {
    l: "Our Craft",
    b: "The LOOMS Craftz story: fabric, finish and calm bedrooms.",
    g: [
      {
        t: "The brand",
        k: [
          ["About LOOMS Craftz", "/our-craft"],
          ["FAQs", "/faqs"],
          ["Contact", "/contact"],
        ],
      },
    ],
    i: IMG[1],
  },
  {
    l: "Contact",
    b: "Ask about stock, custom sizes or bulk orders.",
    g: [
      {
        t: "Get in touch",
        k: [
          ["Contact & hours", "/contact"],
          ["Order on WhatsApp", "/contact"],
        ],
      },
    ],
    i: IMG[2],
  },
  {
    l: "Shop",
    b: "Browse the full catalogue.",
    g: [
      {
        t: "Catalogue",
        k: [
          ["All collections", "/collections"],
          ["Sheet sets", "/collections?category=Sheet Sets"],
          ["Duvet covers", "/collections?category=Duvet Covers"],
          ["Wishlist", "/wishlist"],
        ],
      },
    ],
    i: IMG[0],
  },
];

export const HERO = IMG[2];
export const CRAFT = IMG[1];
