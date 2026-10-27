export type { Product, Variant } from "./data";
export type HomeContent = {
  kicker: string;
  headline1: string;
  headline2: string;
  subtext: string;
  heroImage?: string;
  craftTitle: string;
  craftText: string;
  craftImage?: string;
  testimonials: { quote: string; name: string; meta: string }[];
};
export type Settings = {
  tagline: string;
  about: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
};
export type Faq = { question: string; answer: string };
export type PageDoc = { title: string; body: string };

export type EnquiryPayload = {
  name: string;
  contact: string;
  message: string;
  productSlug?: string;
  productName?: string;
  variantColour?: string;
  variantSku?: string;
};

export type CartItemInput = {
  slug: string;
  size: string;
  colour: string;
  qty: number;
  sku?: string;
  price?: number;
};

export type CartValidationItem = {
  slug: string;
  size: string;
  colour: string;
  qty: number;
  name: string;
  sku: string;
  price: number;
  mrp?: number;
  image: string;
  inStock: boolean;
  isDeleted: boolean;
  priceChanged: boolean;
};

export type CartValidationResponse = {
  items: CartValidationItem[];
  subtotal: number;
  totalMrp: number;
  totalSavings: number;
  hasUnavailableItems: boolean;
  hasPriceChanges: boolean;
};
