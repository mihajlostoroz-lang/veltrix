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
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
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
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100, padding: "7px 18px", marginBottom: 28
          }}>
            <span className="animate-pulse-dot" style={{ width: 8, height: 8, background: "#22c55e", borderRadius: "50%" }} />
            <span style={{ fontSize: ".75rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: ".02em" }}>Available this weekend · Union County, NJ</span>
          </div>

          <h1 className="reveal" style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
            fontWeight: 900, lineHeight: 1,
            color: "#ffffff", letterSpacing: "-3px",
            marginBottom: 24
          }}>
            We bring the<br />
            detail to<br />
            <em style={{ color: "#93c5fd", fontStyle: "italic" }}>your door.</em>
          </h1>

          <p className="reveal" style={{
            fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8,
            fontWeight: 400, maxWidth: 420, marginBottom: 36
          }}>
            Professional mobile detailing in Union County, NJ. Skip the drive — we come to your home or office and make it spotless.
          </p>

          <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44 }}>
            <a href="#contact" style={{
              background: "#2563eb", color: "#fff",
              padding: "14px 30px", borderRadius: 100,
              fontSize: ".95rem", fontWeight: 600, textDecoration: "none"
            }}>Book a Detail</a>
            <a href="#pricing" style={{
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              padding: "14px 30px", borderRadius: 100,
              fontSize: ".95rem", fontWeight: 600, textDecoration: "none"
            }}>See Pricing</a>
          </div>

          <div className="reveal" style={{
            display: "flex", gap: 36, paddingTop: 36,
            borderTop: "1px solid rgba(255,255,255,0.12)", flexWrap: "wrap"
          }}>
            {[["500+", "Happy clients"], ["5.0★", "Google rating"], ["3+", "Years in NJ"]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.5px", color: "#ffffff" }}>{n}</div>
                <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="animate-float" style={{
            background: "rgba(255,255,255,0.07)", borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)"
          }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 14, lineHeight: 1 }}>🚗</div>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#ffffff", marginBottom: 4 }}>Veltrix Mobile Detailing</div>
            <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.45)", marginBottom: 22 }}>Union County, NJ · 10-Mile Radius</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Fully Insured", "5-Star Rated", "No Prepayment", "We Come to You"].map((b) => (
                <span key={b} style={{
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 100, padding: "5px 13px",
                  fontSize: ".72rem", fontWeight: 600, color: "rgba(255,255,255,0.85)"
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
                background: "rgba(255,255,255,0.07)", borderRadius: 16,
                padding: "18px 18px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)"
              }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontWeight: 600, fontSize: ".82rem", color: "#ffffff" }}>{c.val}</div>
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
