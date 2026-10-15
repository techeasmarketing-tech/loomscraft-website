"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO, CRAFT, cover, WHY_CHOOSE, ROOM_STYLES } from "@/lib/data";
import type { Product } from "@/lib/data";
import type { HomeContent } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 1,
      delay: 0.2 + i * 0.18,
      ease: [0.2, 0.7, 0.1, 1] as any,
    },
  }),
};
export default function HomeView({
  products: PRODUCTS,
  cats,
  home,
}: {
  products: Product[];
  cats: string[];
  home: HomeContent;
}) {
  const CATS = cats.filter((c) => PRODUCTS.some((p) => p.cat === c));
  const r = useRef(null);
  const { scrollYProgress } = useScroll({
    target: r,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const s = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const cr = useRef(null);
  const { scrollYProgress: cp } = useScroll({
    target: cr,
    offset: ["start end", "end start"],
  });
  const ry = useTransform(cp, [0, 1], [14, -14]);
  const cy = useTransform(cp, [0, 1], [60, -60]);
  return (
    <>
      <section className="hero" ref={r}>
        <motion.img
          src={home.heroImage || HERO}
          alt=""
          style={{ y, scale: s }}
        />
        <div className="shade" />
        <motion.div className="hc" style={{ opacity: op }}>
          <p className="kick">{home.kicker}</p>
          <h1>
            <span className="ln">
              <motion.span
                custom={0}
                variants={line}
                initial="hidden"
                animate="show"
              >
                {home.headline1}
              </motion.span>
            </span>
            <span className="ln">
              <motion.em
                custom={1}
                variants={line}
                initial="hidden"
                animate="show"
              >
                {home.headline2}
              </motion.em>
            </span>
          </h1>
          <p className="sub">{home.subtext}</p>
          <div className="cta">
            <Link className="btn" href="/collections">
              Shop bedding
            </Link>
            <Link className="btn ghost" href="/contact">
              Enquire now
            </Link>
          </div>
        </motion.div>
      </section>
      <section className="sec">
        <h2 className="st">Shop by category</h2>
        <div className="cats">
          {CATS.map((c) => {
            const p = PRODUCTS.find((x) => x.cat === c);
            const imgUrl = p ? cover(p) : (home.heroImage || HERO);
            return (
              <Link
                key={c}
                href={`/collections?category=${encodeURIComponent(c)}`}
                className="cat"
              >
                <img src={imgUrl} alt={c} />
                <span>{c}</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="sec">
        <div className="narrow">
          <p className="kick dark">Why choose Loomz</p>
          <h2 className="st">Thoughtful design for softer, easier nights.</h2>
        </div>
        <div className="why-grid">
          {WHY_CHOOSE.map((item) => (
            <div key={item.title} className="why-card">
              <span className="why-number">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="sec">
        <h2 className="st">Shop by room</h2>
        <div className="room-grid">
          {ROOM_STYLES.map((room) => (
            <Link key={room.name} href={room.href} className="room-card">
              <img src={room.image} alt={room.name} />
              <div className="room-copy">
                <span>Shop now</span>
                <h3>{room.name}</h3>
                <p>{room.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="sec">
        <h2 className="st">Featured pieces</h2>
        <div className="grid">
          {(PRODUCTS.filter((p) => p.featured).length > 0
            ? PRODUCTS.filter((p) => p.featured)
            : PRODUCTS
          )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
        </div>
        <p className="more">
          <Link className="btn ghost dark" href="/collections">
            View all collections
          </Link>
        </p>
      </section>
      <section className="sec testimonials-wrap">
        <div className="narrow">
          <p className="kick dark">Testimonials</p>
          <h2 className="st">Loved by homes that want softer mornings.</h2>
        </div>
        <div className="testimonials">
          {home.testimonials.map((item) => (
            <blockquote key={item.name} className="testimonial-card">
              <p>“{item.quote}”</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.meta}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
      <section className="craft" ref={cr}>
        <motion.div className="cimg" style={{ rotateY: ry, y: cy }}>
          <img src={home.craftImage || CRAFT} alt="" />
        </motion.div>
        <div className="ct">
          <h2>{home.craftTitle}</h2>
          <p>{home.craftText}</p>
          <Link className="btn" href="/our-craft">
            Read our story
          </Link>
        </div>
      </section>
    </>
  );
}
