export default function Loading() {
  return (
    <div
      className="sec"
      style={{
        paddingTop: "6rem",
        paddingBottom: "6rem",
        textAlign: "center",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "2px solid var(--line)",
          borderTopColor: "var(--gold)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "1.5rem",
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p
        className="kick dark"
        style={{ letterSpacing: "0.2em", fontSize: "0.8rem" }}
      >
        Loom Craftz
      </p>
      <p style={{ color: "var(--mut)", fontSize: "0.95rem" }}>
        Loading soft layers...
      </p>
    </div>
  );
}
