"use client";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ImageReveal from "@/components/ImageReveal";
import SanityImage from "@/components/SanityImage";
import { wa } from "@/lib/whatsapp";
import type { Settings } from "@/lib/types";

/*
 * DRAFT COPY - replace with the founder's real words in Sanity
 * (Site settings > Founder story). Nothing below states a date, number or
 * origin; it only reuses promises the site already makes.
 */
const DEFAULT_QUOTE =
    "The bed is where every day ends and begins. It deserves more care than a product page can ever show.";
const DEFAULT_STORY = [
    "Loom Craftz began with a simple belief: the place you sleep deserves real attention. A bedsheet is the one thing you touch every single night, so we treat it that way.",
    "That is why every sheet is cut for deep mattresses, stitched with strong elastic and washed for softness before it reaches your bed, and why we keep our colours calm so your bedroom can be too.",
    "And because buying bedding online can feel uncertain, we keep it personal. You speak with us directly on WhatsApp or by phone, and we confirm stock, delivery and payment with you before anything is final.",
];

const PILLARS = [
    {
        n: "01",
        t: "Talk to a real person",
        d: "Ask questions and order directly on WhatsApp or by phone. No call centres, no bots.",
    },
    {
        n: "02",
        t: "Confirmed before you pay",
        d: "We confirm stock, delivery and payment with you personally before anything is final.",
    },
    {
        n: "03",
        t: "Made for real beds",
        d: "Deep-pocket fits, strong elastic and soft finishes, cut for the mattresses people actually own.",
    },
    {
        n: "04",
        t: "Backed by a company",
        d: "Loom Craftz is a venture of Savade Pvt Ltd, a registered company you can hold accountable.",
    },
];

export default function FounderStory({ s }: { s: Settings }) {
    const name = (s.founderName || "Devang Bhardwaj").trim();
    // const signatureName = name || "Devang Bhardwaj";
    const role = (s.founderRole || "").trim() || "Founder, Loom Craftz";
    const quote = (s.founderQuote || "").trim() || DEFAULT_QUOTE;
    const story = (s.founderStory || "")
        .split(/\n\s*\n/)
        .map((x) => x.trim())
        .filter(Boolean);
    const paragraphs = story.length ? story : DEFAULT_STORY;
    const waHref = wa(
        "Hello Loom Craftz, I read your story and would like to talk about bedding.",
        s.whatsapp,
    );

    return (
        <section className="founder" aria-labelledby="founder-title">
            <div className="founder-in">
                <div className="founder-media">
                    <ImageReveal className="founder-photo">
                        {s.founderPhoto ? (
                            <SanityImage
                                src={s.founderPhoto}
                                alt={name ? `${name}, founder of Loom Craftz` : "Founder of Loom Craftz"}
                                fill
                                sizes="(max-width: 900px) 90vw, 40vw"
                            />
                        ) : (
                            <div className="founder-mono">
                                <Image
                                    src="/founder.png"
                                    alt="Loom Craftz"
                                    width={940}
                                    height={672}
                                    sizes="320px"
                                />
                            </div>
                        )}
                    </ImageReveal>
                    {/* Signature Section, will be displayed below the image */}
                    {/* <span className="founder-photo-signature" aria-label={`${signatureName}, founder signature`}>
                        {signatureName}
                    </span> */}
                    <Reveal delay={0.4}>
                        <div className="founder-badge">
                            <strong>{name || "Our Founder"}</strong>
                            <span>{role}</span>
                        </div>
                    </Reveal>
                </div>

                <div className="founder-copy">
                    <Reveal>
                        <p className="kick">The story behind Loom Craftz</p>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <h2 id="founder-title">
                            Made with care, backed by people you can talk to.
                        </h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <blockquote className="founder-quote">{quote}</blockquote>
                    </Reveal>
                    {paragraphs.map((p, i) => (
                        <Reveal key={i} delay={0.1}>
                            <p className="founder-p">{p}</p>
                        </Reveal>
                    ))}
                    <Reveal delay={0.1}>
                        <div className="founder-sign">
                            <span className="sig">{name || "The Founder"}</span>
                            <small>{role}</small>
                        </div>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <div className="founder-cta">
                            {waHref && (
                                <a className="btn gold" href={waHref} target="_blank" rel="noopener noreferrer">
                                    Talk to us on WhatsApp
                                </a>
                            )}
                            <Link className="btn ghost" href="/collections">
                                Explore the collection
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>

            <div className="trust">
                {PILLARS.map((p, i) => (
                    <Reveal key={p.n} delay={i * 0.1}>
                        <div className="trust-card">
                            <span>{p.n}</span>
                            <h3>{p.t}</h3>
                            <p>{p.d}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}