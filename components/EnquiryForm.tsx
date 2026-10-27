"use client";
import { useState } from "react";

type Props = {
  productSlug?: string;
  productName?: string;
  variantColour?: string;
  variantSku?: string;
  onSuccess?: () => void;
};

export default function EnquiryForm({
  productSlug,
  productName,
  variantColour,
  variantSku,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    productName
      ? `Hi, I would like more information about ${productName}${variantColour ? ` in ${variantColour}` : ""}.`
      : "",
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    enquiryId: string;
    whatsappUrl: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!contact.trim())
      newErrors.contact = "Phone or WhatsApp number is required.";
    if (!message.trim()) newErrors.message = "Message is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          email,
          message,
          productSlug,
          productName,
          variantColour,
          variantSku,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ form: data.error || "Submission failed. Please try again." });
        }
      } else {
        setResult({
          enquiryId: data.enquiryId,
          whatsappUrl: data.whatsappUrl,
          message: data.message,
        });
        if (onSuccess) onSuccess();
      }
    } catch {
      setErrors({
        form: "Network error submitting enquiry. Please check your connection or contact us on WhatsApp.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="enquiry-success" style={{ padding: "1.5rem", background: "var(--sand)", border: "1px solid var(--line)", marginTop: "1.5rem" }}>
        <h3 style={{ color: "var(--navy)", marginBottom: "0.5rem" }}>Continue your enquiry</h3>
        <p style={{ marginBottom: "1rem", lineHeight: 1.6 }}>
          {result.message} Reference: <code>{result.enquiryId}</code>.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {result.whatsappUrl && <a
            className="btn wa"
            href={result.whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Chat directly on WhatsApp
          </a>}
          <button
            className="btn ghost dark"
            onClick={() => {
              setResult(null);
              setMessage("");
            }}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginTop: "1.5rem" }}>
      {productName && (
        <div style={{ padding: "0.8rem 1rem", background: "var(--sand)", border: "1px solid var(--line)", fontSize: "0.85rem" }}>
          Enquiring about: <strong>{productName}</strong>
          {variantColour && ` · Colour: ${variantColour}`}
          {variantSku && ` · SKU: ${variantSku}`}
        </div>
      )}

      {errors.form && (
        <div style={{ color: "#b91c1c", fontSize: "0.85rem", background: "#fef2f2", padding: "0.75rem", border: "1px solid #fecaca" }}>
          {errors.form}
        </div>
      )}

      <div>
        <label htmlFor="enquiry-name" style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", color: "var(--mut)" }}>
          Your Name *
        </label>
        <input
          id="enquiry-name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "error-name" : undefined}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Priya Sharma"
          style={{ width: "100%", padding: "0.9rem 1rem", border: errors.name ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit" }}
        />
        {errors.name && <span id="error-name" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.name}</span>}
      </div>

      <div className="enquiry-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label htmlFor="enquiry-contact" style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", color: "var(--mut)" }}>
            Phone / WhatsApp *
          </label>
          <input
            id="enquiry-contact"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "error-contact" : undefined}
            type="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. 9876543210"
            style={{ width: "100%", padding: "0.9rem 1rem", border: errors.contact ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit" }}
          />
          {errors.contact && <span id="error-contact" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.contact}</span>}
        </div>

        <div>
          <label htmlFor="enquiry-email" style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", color: "var(--mut)" }}>
            Email (Optional)
          </label>
          <input
            id="enquiry-email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. priya@example.com"
            style={{ width: "100%", padding: "0.9rem 1rem", border: errors.email ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit" }}
          />
          {errors.email && <span id="error-email" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.email}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="enquiry-message" style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", color: "var(--mut)" }}>
          Message / Requirement *
        </label>
        <textarea
          id="enquiry-message"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "error-message" : undefined}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your requirements, custom size needs, or questions..."
          style={{ width: "100%", padding: "0.9rem 1rem", border: errors.message ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit", resize: "vertical" }}
        />
        {errors.message && <span id="error-message" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.message}</span>}
      </div>

      <button type="submit" className="btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? "Sending enquiry..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
