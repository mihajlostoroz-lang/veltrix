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
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%",
        background: "rgba(245,244,240,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(26,26,46,0.1)" : "1px solid transparent",
        transition: "border-color .3s, box-shadow .3s",
        boxShadow: scrolled ? "0 2px 20px rgba(26,26,46,0.06)" : "none",
      }}>
        <a href="#home" style={{
          fontFamily: "'Poppins', sans-serif", fontWeight: 800,
          fontSize: "1.35rem", color: "#1a1a2e",
          letterSpacing: "-0.5px", textDecoration: "none", padding: "18px 0"
        }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
        </a>

        <ul style={{ display: "flex", gap: 32, listStyle: "none", margin: 0, padding: 0 }} className="nav-links-desktop">
          {["services", "pricing", "gallery", "reviews", "contact"].map((id) => (
            <li key={id}>
              <a href={`#${id}`} style={{
                fontSize: ".85rem", fontWeight: 500, color: "#666",
                textDecoration: "none", transition: "color .2s"
              }} className="nav-link">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }} className="nav-right-desktop">
          <a href="tel:9084996895" style={{
            fontSize: ".85rem", fontWeight: 600, color: "#1a1a2e",
            textDecoration: "none"
          }}>
            (908) 499-6895
          </a>
          <a href="#contact" style={{
            background: "#2563eb", color: "#fff", borderRadius: 100,
            padding: "10px 22px", fontSize: ".85rem", fontWeight: 600,
            textDecoration: "none"
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
          <span style={{ display: "block", width: 24, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
          <span style={{ display: "block", width: 24, height: 2, background: "#1a1a2e", borderRadius: 2 }} />
        </button>
      </nav>

      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "rgba(245,244,240,0.97)", backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 28
        }}>
          <button onClick={closeMob} style={{
            position: "absolute", top: 18, right: "5%",
            background: "none", border: "none", fontSize: "2rem",
            cursor: "pointer", color: "#1a1a2e"
          }}>×</button>
          {["services", "pricing", "gallery", "reviews", "contact"].map((id) => (
            <a key={id} href={`#${id}`} onClick={closeMob} style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "2rem",
              fontWeight: 700, color: "#1a1a2e", textDecoration: "none"
            }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <a href="tel:9084996895" onClick={closeMob} style={{
            fontFamily: "'Poppins', sans-serif", fontSize: "1.3rem",
            fontWeight: 600, color: "#1a1a2e", textDecoration: "none"
          }}>
            (908) 499-6895
          </a>
          <a href="#contact" onClick={closeMob} style={{
            background: "#2563eb", color: "#fff",
            padding: "14px 40px", borderRadius: 100,
            fontFamily: "'Poppins', sans-serif", fontSize: "1rem", fontWeight: 700,
            textDecoration: "none"
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
