"use client";
import Image, { type ImageLoaderProps } from "next/image";
export const sanityImageUrl = (src: string, fit: "crop" | "max", width?: number) => {
  if (!src.includes("cdn.sanity.io") && !src.includes("images.unsplash.com")) return src;
  const url = new URL(src); url.searchParams.set("fit", fit);
  if (width) url.searchParams.set("w", String(width));
  if (fit === "max") { url.searchParams.delete("h"); url.searchParams.delete("fp-x"); url.searchParams.delete("fp-y"); url.searchParams.delete("fp-z"); }
  return url.toString();
};
const loader = ({ src, width }: ImageLoaderProps) => sanityImageUrl(src, new URL(src).searchParams.get("fit") === "max" ? "max" : "crop", width);
export default function SanityImage(props: React.ComponentProps<typeof Image>) { return <Image {...props} loader={loader} />; }
