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
      background: "#f5f4f0",
      position: "relative", overflow: "hidden"
    }}>
      <div className="hero-inner" style={{
        maxWidth: 1200, margin: "0 auto", width: "100%",
        display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
        gap: 72, alignItems: "center",
        position: "relative", zIndex: 2
      }}>
        {/* Left */}
        <div>
          <div className="reveal" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#fff", border: "1px solid rgba(26,26,46,0.1)",
            borderRadius: 100, padding: "7px 18px", marginBottom: 28
          }}>
            <span className="animate-pulse-dot" style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ fontSize: ".75rem", fontWeight: 600, color: "#444", letterSpacing: ".02em" }}>Available this weekend · Union County, NJ</span>
          </div>

          <h1 className="reveal" style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
            fontWeight: 900, lineHeight: 1,
            color: "#1a1a2e", letterSpacing: "-3px",
            marginBottom: 24
          }}>
            We bring the<br />
            detail to<br />
            <em style={{ color: "#2563eb", fontStyle: "italic" }}>your door.</em>
          </h1>

          <p className="reveal" style={{
            fontSize: "1.05rem", color: "#666", lineHeight: 1.8,
            fontWeight: 400, maxWidth: 420, marginBottom: 36
          }}>
            Professional mobile detailing in Union County, NJ. Skip the drive — we come to your home or office and make it spotless.
          </p>

          <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}>
            <a href="#contact" style={{
              background: "#1a1a2e", color: "#fff",
              padding: "14px 30px", borderRadius: 100,
              fontSize: ".95rem", fontWeight: 600, textDecoration: "none"
            }}>Book a Detail</a>
            <a href="#pricing" style={{
              background: "#fff", color: "#1a1a2e",
              border: "1px solid rgba(26,26,46,0.15)",
              padding: "14px 30px", borderRadius: 100,
              fontSize: ".95rem", fontWeight: 600, textDecoration: "none"
            }}>See Pricing</a>
          </div>

          <div className="reveal" style={{
            display: "flex", gap: 36, paddingTop: 36,
            borderTop: "1px solid rgba(26,26,46,0.1)", flexWrap: "wrap"
          }}>
            {[["500+", "Happy clients"], ["5.0★", "Google rating"], ["3+", "Years in NJ"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px", color: "#1a1a2e" }}>{n}</div>
                <div style={{ fontSize: ".75rem", color: "#999", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="animate-float" style={{
            background: "#fff", borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 4px 32px rgba(26,26,46,0.08)",
            border: "1px solid rgba(26,26,46,0.06)"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 14, lineHeight: 1 }}>🚗</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1a1a2e", marginBottom: 4 }}>Veltrix Mobile Detailing</div>
            <div style={{ fontSize: ".82rem", color: "#999", marginBottom: 22 }}>Union County, NJ · 10-Mile Radius</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Fully Insured", "5-Star Rated", "No Prepayment", "We Come to You"].map((b) => (
                <span key={b} style={{
                  background: "#f5f4f0", border: "1px solid rgba(26,26,46,0.08)",
                  borderRadius: 100, padding: "5px 13px",
                  fontSize: ".72rem", fontWeight: 600, color: "#444"
                }}>{b}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { icon: "📞", label: "Phone", val: "(862) 394-3198" },
              { icon: "🕐", label: "Hours", val: "Sat & Sun" },
              { icon: "📍", label: "Area", val: "Union County" },
              { icon: "⭐", label: "Rating", val: "5.0 on Google" },
            ].map((c) => (
              <div key={c.label} style={{
                background: "#fff", borderRadius: 16,
                padding: "18px 18px",
                boxShadow: "0 2px 16px rgba(26,26,46,0.05)",
                border: "1px solid rgba(26,26,46,0.06)"
              }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontWeight: 600, fontSize: ".82rem", color: "#1a1a2e" }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .hero-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
