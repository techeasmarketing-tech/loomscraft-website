"use client";
import { useState } from "react";
import Link from "next/link";
import { parsePhoneNumberFromString } from "libphonenumber-js";

type Props = {
  productSlug?: string;
  productName?: string;
  variantColour?: string;
  variantSku?: string;
  termsAvailable?: boolean;
  onSuccess?: () => void;
};

export default function EnquiryForm({
  productSlug,
  productName,
  variantColour,
  variantSku,
  termsAvailable = false,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
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
    const phoneNumber = parsePhoneNumberFromString(contact.trim());
    if (!phoneNumber?.isValid())
      newErrors.contact =
        "Enter a valid phone number including its country calling code (e.g. +91 98765 43210).";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (message.trim().length > 2000)
      newErrors.message = "Message must be 2000 characters or fewer.";

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
          consent,
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
              setConsent(false);
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
            Phone number with country code *
          </label>
          <input
            id="enquiry-contact"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? "error-contact" : undefined}
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+91 98765 43210"
            style={{ width: "100%", padding: "0.9rem 1rem", border: errors.contact ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit" }}
          />
          {errors.contact && <span id="error-contact" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.contact}</span>}
        </div>

        <div>
          <label htmlFor="enquiry-email" style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem", color: "var(--mut)" }}>
            Email *
          </label>
          <input
            id="enquiry-email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "error-email" : undefined}
            type="email"
            required
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
          Message / Requirement (Optional)
        </label>
        <textarea
          id="enquiry-message"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "error-message" : undefined}
          rows={4}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your requirements, custom size needs, or questions..."
          style={{ width: "100%", padding: "0.9rem 1rem", border: errors.message ? "1px solid #b91c1c" : "1px solid var(--line)", background: "#fff", font: "inherit", resize: "vertical" }}
        />
        {errors.message && <span id="error-message" role="alert" style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: "0.2rem", display: "block" }}>{errors.message}</span>}
      </div>

      <div className="enquiry-consent">
        <input
          id="enquiry-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "error-consent" : undefined}
        />
        <p>
          <label htmlFor="enquiry-consent">
            Optional: I agree to be contacted by Loom Craftz via WhatsApp and/or email regarding my enquiry
            {termsAvailable && ", in accordance with the "}
          </label>
          {termsAvailable && (
            <>
              <Link href="/terms">Terms and Conditions</Link>.
            </>
          )}
          {!termsAvailable && "."}
        </p>
      </div>

      <button type="submit" className="btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
        {loading ? "Sending enquiry..." : "Submit Enquiry"}
      </button>
    </form>
  );
}
