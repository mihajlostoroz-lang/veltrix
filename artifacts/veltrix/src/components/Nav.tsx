import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMob = () => setMobileOpen(false);

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 5%",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid #e2e8f0",
          transition: "box-shadow .3s",
          boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.07)" : "none",
        }}
      >
        <a href="#home" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#0f172a", letterSpacing: "-0.5px", textDecoration: "none" }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
        </a>

        <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }} className="nav-links-desktop">
          {["services", "pricing", "gallery", "reviews", "contact"].map((id) => (
            <li key={id}>
              <a href={`#${id}`} style={{ fontSize: ".88rem", fontWeight: 500, color: "#64748b", textDecoration: "none" }}
                className="nav-link">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="nav-right-desktop">
          <a href="tel:8623943198" style={{ fontSize: ".88rem", fontWeight: 600, color: "#0f172a", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            📞 (862) 394-3198
          </a>
          <a href="#contact" style={{
            background: "#2563eb", color: "#fff", borderRadius: 50,
            padding: "10px 22px", fontSize: ".88rem", fontWeight: 500,
            textDecoration: "none", boxShadow: "0 4px 16px rgba(37,99,235,0.28)"
          }}>
            Book Now
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          style={{ display: "none", flexDirection: "column", gap: 5, cursor: "pointer", background: "none", border: "none", padding: 4 }}
          className="burger-btn"
          aria-label="Menu"
        >
          <span style={{ display: "block", width: 24, height: 2, background: "#0f172a", borderRadius: 2 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#0f172a", borderRadius: 2 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#0f172a", borderRadius: 2 }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28
        }}>
          <button onClick={closeMob} style={{ position: "absolute", top: 18, right: "5%", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", color: "#0f172a" }}>×</button>
          {["services", "pricing", "gallery", "reviews", "contact"].map((id) => (
            <a key={id} href={`#${id}`} onClick={closeMob}
              style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <a href="tel:8623943198" onClick={closeMob}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>
            📞 (862) 394-3198
          </a>
          <a href="#contact" onClick={closeMob}
            style={{
              background: "#2563eb", color: "#fff",
              padding: "14px 40px", borderRadius: 50,
              fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700,
              textDecoration: "none", boxShadow: "0 6px 24px rgba(37,99,235,0.3)"
            }}>
            Book Now
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 920px) {
          .nav-links-desktop { display: none !important; }
          .nav-right-desktop { display: none !important; }
          .burger-btn { display: flex !important; }
        }
        .nav-link:hover { color: #2563eb !important; }
      `}</style>
    </>
  );
}
