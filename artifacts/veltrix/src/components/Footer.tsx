import { Link } from "wouter";

export default function Footer() {
  return (
    <footer style={{ background: "#020617", padding: "44px 5%", textAlign: "center" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
        Velt<span style={{ color: "#2563eb" }}>rix</span>
      </div>
      <div style={{ fontSize: ".85rem", color: "#475569", marginBottom: 6 }}>
        Mobile Detailing · Union County, NJ
      </div>
      <div style={{ fontSize: ".78rem", color: "#334155", marginBottom: 18 }}>
        © {new Date().getFullYear()} Veltrix Mobile Detailing. All rights reserved.
      </div>
      <Link href="/admin" style={{
        fontSize: ".72rem", color: "#1e3a5f",
        textDecoration: "none", opacity: 0.5,
        transition: "opacity .2s",
        letterSpacing: ".04em"
      }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
      >
        Owner Login
      </Link>
    </footer>
  );
}
