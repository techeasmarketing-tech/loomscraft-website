import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPageSlugs, getFaqs, getPage, getSettings } from "@/lib/sanity";
import EnquiryForm from "@/components/EnquiryForm";
import FounderStory from "@/components/FounderStory";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;

  if (slug === "faqs") {
    return {
      title: "Frequently Asked Questions",
      description:
        "Common questions about ordering, bedsheet sizes, care instructions, and delivery.",
      alternates: { canonical: "/faqs" },
    };
  }

  if (slug === "contact") {
    return {
      title: "Contact & Enquiries",
      description:
        "Get in touch with Loom Craftz for orders, custom sizes, stock questions, or WhatsApp assistance.",
      alternates: { canonical: "/contact" },
    };
  }

  const p = await getPage(slug);
  if (!p) {
    return slug === "our-craft"
      ? {
        title: "Our Craft & Story",
        description:
          "The story behind Loom Craftz: fabric, finish and calm bedrooms, and the people behind it.",
        alternates: { canonical: "/our-craft" },
      }
      : {};
  }

  return {
    title: p.title,
    description: (p.body || "").slice(0, 160),
    alternates: { canonical: `/${slug}` },
  };
}

export default async function P({ params }: Params) {
  const { slug } = await params;

  if (slug === "faqs") {
    const faqs = await getFaqs();
    return (
      <div className="sec faq-layout">
        <div className="faq-content">
          <h1 className="st">Frequently asked questions</h1>
          <div className="faq-list">
            {faqs.map((q) => (
              <details className="faq-item" key={q.question}>
                <summary className="faq-q">{q.question}</summary>
                <p className="lead">{q.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <aside className="faq-note" aria-label="Our bedding details">
          <p className="faq-note-kicker">Thoughtfully made</p>
          <h2>Comfort in the details</h2>
          <ul>
            <li>Long-staple cotton</li>
            <li>Cut for deep mattresses</li>
            <li>Finished to last wash after wash</li>
          </ul>
        </aside>
      </div>
    );
  }

  if (slug === "contact") {
    const [s, pageSlugs] = await Promise.all([getSettings(), getAllPageSlugs()]);
    const termsAvailable = pageSlugs.includes("terms");
    return (
      <div className="sec contact-page">
        <h1 className="st">Contact & Enquiries</h1>
        <div className="contact-columns">
          <section className="contact-details">
            <div className="contact-help">
              <h2>How can we help?</h2>
              <p>
                Send us an enquiry about any part of your bedding needs,
                including:
              </p>
              <ul>
                <li>Fabric and feel</li>
                <li>Sizes and mattress fit</li>
                <li>Product and care questions</li>
                <li>Bulk and hospitality orders</li>
              </ul>
            </div>
            <div className="contact-studio">
              <p className="lead" style={{ fontWeight: 500, color: "var(--navy)" }}>
                Loom Craftz Studio
              </p>
              <p className="lead">Meerut, Uttar Pradesh</p>
              <p className="lead">
                Phone:{" "}
                <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>{s.phone}</a>
              </p>
            </div>
          </section>

          <section className="contact-form-panel">
            <h2 style={{ fontSize: "1.8rem", color: "var(--navy)", marginBottom: "0.5rem" }}>
              Send an Online Enquiry
            </h2>
            <p className="lead">
              Share your details and we’ll prepare your enquiry for you to send.
            </p>
            <EnquiryForm termsAvailable={termsAvailable} />
          </section>
        </div>
        <div className="contact-map">
          <iframe
            title="Map showing Meerut, Uttar Pradesh"
            src="https://maps.google.com/maps?q=Meerut%2C%20Uttar%20Pradesh%2C%20India&z=12&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    );
  }

  const p = await getPage(slug);

  if (slug === "our-craft") {
    const s = await getSettings();
    return (
      <>
        {p && (
          <div className="sec narrow craft-intro">
            <div className="craft-copy">
              <h1 className="st">{p.title}</h1>
              {(p.body || "")
                .split(/\n\s*\n/)
                .filter(Boolean)
                .map((x, i) => (
                  <p key={i} className="lead">
                    {x}
                  </p>
                ))}
            </div>
            <Image
              className="craft-logo"
              src="/logo.png"
              alt="Loom Craftz"
              width={256}
              height={319}
              sizes="(max-width: 900px) 220px, 280px"
            />
          </div>
        )}
        <FounderStory s={s} />
      </>
    );
  }

  if (!p) notFound();

  return (
    <div className="sec narrow">
      <h1 className="st">{p.title}</h1>
      {(p.body || "")
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((x, i) => (
          <p key={i} className="lead">
            {x}
          </p>
        ))}
    </div>
  );
}