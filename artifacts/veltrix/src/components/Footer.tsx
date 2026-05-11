export default function Footer() {
  return (
    <footer style={{ background: "#020617", padding: "44px 5%", textAlign: "center" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
        Velt<span style={{ color: "#2563eb" }}>rix</span>
      </div>
      <div style={{ fontSize: ".85rem", color: "#475569", marginBottom: 6 }}>
        Mobile Detailing · Union County, NJ
      </div>
      <div style={{ fontSize: ".78rem", color: "#334155" }}>
        © {new Date().getFullYear()} Veltrix Mobile Detailing. All rights reserved.
      </div>
    </footer>
  );
}
