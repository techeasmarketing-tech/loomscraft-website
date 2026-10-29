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
      <div className="sec narrow">
        <h1 className="st">Frequently asked questions</h1>
        {faqs.map((q) => (
          <div key={q.question}>
            <h3 className="faq-q">{q.question}</h3>
            <p className="lead">{q.answer}</p>
          </div>
        ))}
      </div>
    );
  }

  if (slug === "contact") {
    const [s, pageSlugs] = await Promise.all([getSettings(), getAllPageSlugs()]);
    const termsAvailable = pageSlugs.includes("terms");
    return (
      <div className="sec narrow">
        <h1 className="st">Contact & Enquiries</h1>
        <div style={{ marginBottom: "2rem" }}>
          <p className="lead" style={{ fontWeight: 500, color: "var(--navy)" }}>
            Loom Craftz Studio
          </p>
          <p className="lead">Meerut, Uttar Pradesh</p>
          <p className="lead">
            Phone:{" "}
            <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>{s.phone}</a>
          </p>
          <div className="contact-map">
            <iframe
              title="Map showing Meerut, Uttar Pradesh"
              src="https://maps.google.com/maps?q=Meerut%2C%20Uttar%20Pradesh%2C%20India&z=12&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "3rem 0 2rem" }} />

        <div>
          <h2 style={{ fontSize: "1.8rem", color: "var(--navy)", marginBottom: "0.5rem" }}>
            Send an Online Enquiry
          </h2>
          <p className="lead">
            Share your details and we’ll prepare your enquiry for you to send.
          </p>
          <EnquiryForm termsAvailable={termsAvailable} />
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