"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { wa } from "@/lib/whatsapp";

const EASE = [0.2, 0.7, 0.1, 1] as [number, number, number, number];

function instagramUrl(v: string) {
    const t = v.trim();
    if (!t) return "";
    if (/^https?:\/\//i.test(t)) return t;
    return `https://www.instagram.com/${t.replace(/^@/, "").replace(/\/$/, "")}/`;
}

const icon = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const PhoneIcon = () => (
    <svg {...icon}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const InstagramIcon = () => (
    <svg {...icon}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.6" y1="6.4" x2="17.61" y2="6.4" />
    </svg>
);
const WhatsAppIcon = () => (
    <svg {...icon}>
        <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.6-5.2A8.5 8.5 0 1 1 21 11.5z" />
        <path
            transform="translate(7.4 7.2) scale(0.4)"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        />
    </svg>
);

/**
 * Floating contact dock (phone / Instagram / WhatsApp) fixed to the right edge.
 * Phone + WhatsApp come from Sanity "Site settings"; Instagram is optional and
 * the button only appears once an Instagram handle or link is set.
 */
export default function FloatingContact({
    phone,
    whatsapp,
    instagram,
}: {
    phone: string;
    whatsapp: string;
    instagram?: string;
}) {
    const reduce = useReducedMotion();
    const [page, setPage] = useState("");
    useEffect(() => setPage(window.location.href), []);

    const tel = phone.replace(/[^\d+]/g, "");
    const ig = instagramUrl(instagram || "");
    const message =
        "Hello Loom Craftz, I'd like to enquire about your bedding." +
        (page ? `\n\nI was looking at: ${page}` : "");
    const waHref = wa(message, whatsapp);

    const items = [
        tel && {
            key: "call",
            label: "Call us",
            href: `tel:${tel}`,
            cls: "fc-call",
            node: <PhoneIcon />,
        },
        ig && {
            key: "ig",
            label: "Instagram",
            href: ig,
            cls: "fc-ig",
            node: <InstagramIcon />,
            external: true,
        },
        waHref && {
            key: "wa",
            label: "WhatsApp us",
            href: waHref,
            cls: "fc-wa",
            node: <WhatsAppIcon />,
            external: true,
        },
    ].filter(Boolean) as {
        key: string;
        label: string;
        href: string;
        cls: string;
        node: React.ReactNode;
        external?: boolean;
    }[];

    if (!items.length) return null;

    return (
        <nav className="fc" aria-label="Contact Loom Craftz">
            {items.map((it, i) => (
                <motion.a
                    key={it.key}
                    href={it.href}
                    className={`fc-btn ${it.cls}`}
                    aria-label={it.label}
                    {...(it.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    initial={reduce ? false : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: 1.2 + i * 0.12, ease: EASE }}
                >
                    <span className="fc-tip">{it.label}</span>
                    {it.node}
                </motion.a>
            ))}
        </nav>
    );
}