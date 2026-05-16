import { useEffect, useRef } from "react";

const services = [
  {
    icon: "🚿", title: "Exterior Wash",
    desc: "Full hand wash of the entire body, wheels, tires, and all glass surfaces. Includes tire dressing and a streak-free window finish.",
    note: "Starting at $40", tag: "Most Booked"
  },
  {
    icon: "🪣", title: "Interior Detail",
    desc: "Deep vacuum, steam cleaning, full interior wipe-down, door panels, dashboard, and thorough carpet & upholstery shampoo.",
    note: "Starting at $100", tag: ""
  },
  {
    icon: "✨", title: "Full Detail",
    desc: "Our most complete package — interior + exterior combined. Every surface cleaned, conditioned, and protected inside and out.",
    note: "Starting at $160", tag: "Best Value"
  },
  {
    icon: "⚙️", title: "Engine Bay Cleaning",
    desc: "Safe, thorough degreasing and rinse of the engine bay. Makes your engine look fresh and helps spot potential leaks.",
    note: "Add-on: $50", tag: "Add-on"
  },
  {
    icon: "🐾", title: "Pet Hair Removal",
    desc: "Specialized tools and techniques to remove stubborn pet hair from seats, carpets and all fabric surfaces.",
    note: "Add-on: +$30", tag: "Add-on"
  },
  {
    icon: "🔮", title: "Paint Correction",
    desc: "Remove swirl marks, light scratches and oxidation with professional multi-stage polishing for a showroom-level finish.",
    note: "Custom Quote", tag: "Premium"
  },
  {
    icon: "🛡️", title: "Ceramic Coating",
    desc: "Long-lasting nano-ceramic protection that repels water, resists UV, and keeps your paint looking flawless for years.",
    note: "Custom Quote", tag: "Premium"
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveals = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={ref} style={{ background: "#1a1a2e", padding: "96px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          marginBottom: 56, flexWrap: "wrap", gap: 16
        }}>
          <div>
            <div style={{
              fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
              textTransform: "uppercase", color: "#3b82f6", marginBottom: 12
            }}>What We Do</div>
            <h2 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800,
              letterSpacing: "-2px", color: "#fff"
            }}>Our Services</h2>
          </div>
          <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.4)", maxWidth: 320, lineHeight: 1.7 }}>
            From a quick exterior shine to a complete full-detail — professional results at your driveway.
          </p>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16
        }}>
          {services.map((s) => (
            <div key={s.title} className="reveal svc-card" style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 18, padding: "26px 24px",
              transition: "border-color .3s, background .3s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.4rem"
                }}>{s.icon}</div>
                {s.tag && (
                  <span style={{
                    fontSize: ".65rem", fontWeight: 700, color: "#3b82f6",
                    background: "rgba(59,130,246,0.12)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: 100, padding: "3px 11px", letterSpacing: ".06em"
                  }}>{s.tag}</span>
                )}
              </div>
              <h3 style={{
                fontFamily: "'Poppins', sans-serif", fontSize: ".95rem",
                fontWeight: 700, color: "#fff", marginBottom: 9
              }}>{s.title}</h3>
              <p style={{ fontSize: ".83rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 18 }}>{s.desc}</p>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)"
              }}>
                <span style={{ fontWeight: 700, fontSize: ".9rem", color: "#3b82f6" }}>{s.note}</span>
                <a href="#contact" style={{
                  fontSize: ".72rem", color: "rgba(255,255,255,0.3)",
                  textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.1)",
                  paddingBottom: 1
                }}>Book →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .svc-card:hover {
          background: rgba(255,255,255,0.07) !important;
          border-color: rgba(255,255,255,0.14) !important;
        }
      `}</style>
    </section>
  );
}
