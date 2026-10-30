"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HERO, CRAFT, cover, WHY_CHOOSE, ROOM_STYLES } from "@/lib/data";
import type { Product } from "@/lib/data";
import type { HomeContent } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import SanityImage from "@/components/SanityImage";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import ThreadDivider from "@/components/ThreadDivider";
import Marquee from "@/components/Marquee";

const EASE = [0.2, 0.7, 0.1, 1] as [number, number, number, number];
const TICKER = ["Premium Bedsheets", "Soft Sleep", "Crafted Layers", "Loom Craftz"];

/**
 * Hero background video. To change it, replace the file at
 * public/videos/hero.mp4 (keep the same name) - or point this at another path.
 * If the file is missing, the hero image is shown instead.
 */
const HERO_VIDEO = "/videos/hero.mp4";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 1.2,
      delay: 0.3 + i * 0.2,
      ease: [0.2, 0.7, 0.1, 1] as any,
    },
  }),
};

function SectionHead({
  kicker,
  title,
  light = false,
}: {
  kicker?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <div className={`shead${light ? " light" : ""}`}>
      {kicker && <p className="kick dark">{kicker}</p>}
      <h2 className="st">{title}</h2>
      <span className="rule" aria-hidden="true" />
    </div>
  );
}

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
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => { });
  }, [reduceMotion]);
  const r = useRef(null);
  const { scrollYProgress } = useScroll({
    target: r,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const s = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const op = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const cueOp = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const cr = useRef(null);
  const { scrollYProgress: cp } = useScroll({
    target: cr,
    offset: ["start end", "end start"],
  });
  const ry = useTransform(cp, [0, 1], [14, -14]);
  const cy = useTransform(cp, [0, 1], [60, -60]);
  const featured =
    PRODUCTS.filter((p) => p.featured).length > 0
      ? PRODUCTS.filter((p) => p.featured)
      : PRODUCTS;

  return (
    <>
      <section className="hero" ref={r}>
        <motion.div
          style={{ y, scale: s, position: "absolute", inset: 0 }}
        >
          <SanityImage
            src={home.heroImage || HERO}
            alt="Loom Craftz bedding in a softly styled bedroom"
            fill
            priority
            sizes="100vw"
          />
          {!reduceMotion && (
            <video
              ref={videoRef}
              className={`hero-video${videoOn ? " on" : ""}`}
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
              onCanPlay={() => setVideoOn(true)}
              onError={() => setVideoOn(false)}
            />
          )}
        </motion.div>
        <div className="shade" />
        <motion.div className="hc" style={{ opacity: op }}>
          <motion.p
            className="kick"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            {home.kicker}
          </motion.p>
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
          <motion.p
            className="sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.92, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            {home.subtext}
          </motion.p>
          <motion.div
            className="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Link className="btn" href="/collections">
              Shop bedding
            </Link>
            <Link className="btn ghost" href="/contact">
              Enquire now
            </Link>
          </motion.div>
        </motion.div>
        <motion.div className="cue" style={{ opacity: cueOp }} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </motion.div>
      </section>

      <Marquee items={TICKER} />

      <section className="sec">
        <SectionHead kicker="Collections" title="Shop by category" />
        <div className="cats">
          {CATS.map((c, i) => {
            const p = PRODUCTS.find((x) => x.cat === c);
            const imgUrl = p ? cover(p) : home.heroImage || HERO;
            return (
              <Reveal key={c} delay={i * 0.1}>
                <Link
                  href={`/collections?category=${encodeURIComponent(c)}`}
                  className="cat"
                >
                  <SanityImage
                    src={imgUrl}
                    alt={c}
                    fill
                    sizes="(max-width: 600px) 48vw, 20vw"
                  />
                  <span>{c}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <p className="more cats-more">
          <Link className="btn ghost dark" href="/collections">
            Explore More
          </Link>
        </p>
      </section>

      <ThreadDivider />

      <div className="band">
        <section className="sec">
          <SectionHead
            kicker="Why choose Loom Craftz"
            title="Thoughtful design for softer, easier nights."
            light
          />
          <div className="why-grid">
            {WHY_CHOOSE.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.12}>
                <div className="why-card">
                  <span className="why-number">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* Temporarily hidden at the client's request; keep this section for possible reuse.
      <section className="sec">
        <SectionHead kicker="Curated for you" title="Shop by room" />
        <div className="room-grid">
          {ROOM_STYLES.map((room, i) => (
            <Reveal key={room.name} delay={i * 0.1} className="room-wrap">
              <Link href={room.href} className="room-card">
                <ImageReveal className="room-image" delay={i * 0.1}>
                  <SanityImage
                    src={room.image}
                    alt={room.name}
                    fill
                    sizes="(max-width: 600px) 75vw, 25vw"
                  />
                </ImageReveal>
                <div className="room-copy">
                  <span>Shop now</span>
                  <h3>{room.name}</h3>
                  <p>{room.blurb}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      */}

      <section className="sec">
        <SectionHead kicker="Bestsellers" title="Featured pieces" />
        <div className="grid">
          {featured.slice(0, 4).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="more">
            <Link className="btn ghost dark" href="/collections">
              View all collections
            </Link>
          </p>
        </Reveal>
      </section>

      <section className="sec testimonials-wrap">
        <SectionHead
          kicker="Testimonials"
          title="Loved by homes that want softer mornings."
        />
        <div className="testimonials">
          {home.testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.12}>
              <blockquote className="testimonial-card">
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.meta}</span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="craft" ref={cr}>
        <motion.div className="cimg" style={{ rotateY: ry, y: cy }}>
          <SanityImage
            src={home.craftImage || CRAFT}
            alt=""
            width={800}
            height={1000}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </motion.div>
        <div className="ct">
          <Reveal>
            <p className="kick">Our craft</p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2>{home.craftTitle}</h2>
          </Reveal>
          <Reveal delay={0.24}>
            <p>{home.craftText}</p>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="craft-actions" style={{ display: "flex", gap: "1rem" }}>
              <Link className="btn" href="/our-craft">
                Read our story
              </Link>
              <Link className="btn craft-contact" href="/contact">
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}