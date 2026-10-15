"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront Application Error:", error);
  }, [error]);

  return (
    <div
      className="sec narrow"
      style={{
        paddingTop: "6rem",
        paddingBottom: "6rem",
        textAlign: "center",
      }}
    >
      <p
        className="kick dark"
        style={{ fontSize: "0.85rem", letterSpacing: "0.25em" }}
      >
        Something went wrong
      </p>
      <h1 className="st" style={{ marginBottom: "1.5rem" }}>
        Unable to Load Content
      </h1>
      <p
        className="lead"
        style={{ maxWidth: "520px", margin: "0 auto 2.5rem" }}
      >
        We encountered an unexpected issue while retrieving this page. You can
        try reloading or browse our collections.
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button className="btn" onClick={() => reset()}>
          Try Again
        </button>
        <Link className="btn ghost dark" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
