import { useEffect, useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveals = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="home" ref={ref} style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "110px 5% 80px",
      background: "linear-gradient(150deg, #ffffff 0%, #eff6ff 55%, #dbeafe 100%)",
      position: "relative", overflow: "hidden"
    }}>
      {/* Orbs */}
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 65%)",
        width: 700, height: 700, top: -200, right: -150
      }} />
      <div style={{
        position: "absolute", borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 65%)",
        width: 450, height: 450, bottom: -150, left: -100
      }} />

      <div className="hero-inner" style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 64, alignItems: "center",
        position: "relative", zIndex: 2
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#dbeafe", color: "#2563eb",
            fontSize: ".75rem", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase",
            padding: "7px 16px", borderRadius: 50, marginBottom: 22
          }}>
            <span className="animate-pulse-dot" style={{ width: 8, height: 8, background: "#2563eb", borderRadius: "50%" }} />
            Mobile Detailing · We Come to You
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 3.9rem)",
            fontWeight: 800, lineHeight: 1.08,
            color: "#0f172a", letterSpacing: "-2px",
            marginBottom: 20
          }}>
            Your Car Deserves<br />
            <span style={{ color: "#2563eb" }}>Showroom Clean</span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.75, fontWeight: 300, maxWidth: 440, marginBottom: 14 }}>
            Professional mobile detailing brought straight to your home or office. No travel, no waiting — we handle everything on-site.
          </p>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: ".85rem", fontWeight: 500, color: "#2563eb",
            background: "#eff6ff", padding: "6px 14px", borderRadius: 50,
            marginBottom: 34
          }}>
            📍 Union County, NJ &amp; 10-Mile Radius
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#contact" style={{
              background: "#2563eb", color: "#fff",
              padding: "15px 34px", borderRadius: 50,
              fontSize: ".95rem", fontWeight: 500, textDecoration: "none",
              boxShadow: "0 8px 28px rgba(37,99,235,0.32)"
            }}>Book a Detail</a>
            <a href="#pricing" style={{
              background: "transparent", color: "#2563eb",
              border: "1.5px solid #2563eb",
              padding: "15px 34px", borderRadius: 50,
              fontSize: ".95rem", fontWeight: 500, textDecoration: "none"
            }}>See Pricing</a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".82rem", color: "#64748b" }}>
              <span>⭐</span> 5-Star Rated
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".82rem", color: "#64748b" }}>
              <span>✅</span> Fully Insured
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".82rem", color: "#64748b" }}>
              <span>🚐</span> We Come to You
            </div>
          </div>
        </div>

        {/* Right - Floating Card */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div className="animate-float" style={{
            width: 360, height: 360,
            background: "#ffffff", borderRadius: 36,
            boxShadow: "0 20px 80px rgba(37,99,235,0.18)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
            position: "relative"
          }}>
            <div style={{ fontSize: "6.5rem", lineHeight: 1 }}>🚗</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#0f172a" }}>Veltrix Detailing</div>
            <div style={{ fontSize: ".82rem", color: "#64748b" }}>Union County, NJ</div>

            <div style={{
              position: "absolute", background: "#fff", borderRadius: 18,
              padding: "11px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              fontSize: ".8rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              top: -18, left: -40, whiteSpace: "nowrap"
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              Available Today
            </div>
            <div style={{
              position: "absolute", background: "#fff", borderRadius: 18,
              padding: "11px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              fontSize: ".8rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              bottom: -18, right: -40, whiteSpace: "nowrap"
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
              100% Satisfaction
            </div>
            <div style={{
              position: "absolute", background: "#fff", borderRadius: 18,
              padding: "11px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              fontSize: ".8rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              top: "50%", right: -50, transform: "translateY(-50%)", whiteSpace: "nowrap"
            }} className="badge-b3">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", flexShrink: 0 }} />
              Top Rated ⭐
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .hero-inner { grid-template-columns: 1fr !important; text-align: center; }
          .hero-inner > div:first-child { display: flex; flex-direction: column; align-items: center; }
        }
        @media (max-width: 560px) {
          .animate-float { width: 290px !important; height: 290px !important; }
          .badge-b3 { display: none !important; }
        }
      `}</style>
    </section>
  );
}
