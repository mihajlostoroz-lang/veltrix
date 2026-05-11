import { useState } from "react";

const ADMIN_PIN = "veltrix2024";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onSuccess();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(150deg, #ffffff 0%, #eff6ff 55%, #dbeafe 100%)"
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "48px 44px",
        boxShadow: "0 20px 80px rgba(37,99,235,0.18)", border: "1px solid #e2e8f0",
        width: "100%", maxWidth: 380, textAlign: "center"
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🔐</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: "1.6rem", fontWeight: 800,
          color: "#0f172a", letterSpacing: "-1px", marginBottom: 6
        }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span> Admin
        </h1>
        <p style={{ fontSize: ".85rem", color: "#64748b", marginBottom: 32 }}>
          Enter your admin PIN to continue
        </p>
        <form onSubmit={submit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Admin PIN"
            autoFocus
            style={{
              border: `1.5px solid ${error ? "#ef4444" : "#e2e8f0"}`,
              borderRadius: 12, padding: "13px 16px",
              fontSize: "1rem", width: "100%",
              fontFamily: "'DM Sans', sans-serif",
              color: "#0f172a", outline: "none",
              boxSizing: "border-box", marginBottom: 14,
              textAlign: "center", letterSpacing: ".2em",
              transition: "border-color .2s",
              background: error ? "#fef2f2" : "#fff"
            }}
          />
          {error && (
            <p style={{ fontSize: ".8rem", color: "#ef4444", marginBottom: 12, marginTop: -8 }}>
              Incorrect PIN. Try again.
            </p>
          )}
          <button type="submit" style={{
            width: "100%", padding: "13px", background: "#2563eb", color: "#fff",
            border: "none", borderRadius: 50, fontSize: ".95rem", fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(37,99,235,0.28)"
          }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: 24, fontSize: ".75rem", color: "#94a3b8" }}>
          <a href="/" style={{ color: "#2563eb", textDecoration: "none" }}>← Back to website</a>
        </p>
      </div>
    </div>
  );
}
