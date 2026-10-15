import Link from "next/link";

export default function NotFound() {
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
        Page Not Found
      </p>
      <h1 className="st" style={{ marginBottom: "1.5rem" }}>
        404 — Piece Not Found
      </h1>
      <p
        className="lead"
        style={{ maxWidth: "500px", margin: "0 auto 2.5rem" }}
      >
        The page or product you are looking for may have been moved, renamed, or
        is temporarily unavailable.
      </p>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link className="btn" href="/collections">
          Browse Collections
        </Link>
        <Link className="btn ghost dark" href="/">
          Return Home
        </Link>
      </div>
    </div>
  );
}
