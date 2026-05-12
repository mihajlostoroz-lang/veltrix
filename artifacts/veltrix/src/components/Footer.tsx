import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "#1a1a2e", padding: "44px 5%" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16
      }}>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>
            Mobile Detailing · Union County, NJ
          </div>
          <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Veltrix Mobile Detailing. All rights reserved.
          </div>
        </div>
        <Link href="/admin" style={{
          fontSize: ".75rem", color: "rgba(255,255,255,0.2)",
          textDecoration: "none", transition: "color .2s",
          letterSpacing: ".04em"
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          Owner Login
        </Link>
      </div>
    </footer>
  );
}
