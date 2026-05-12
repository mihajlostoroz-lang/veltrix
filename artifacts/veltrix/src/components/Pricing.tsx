import { useEffect, useRef } from "react";

const plans = [
  {
    badge: "Exterior",
    price: "40",
    range: "$40 – $50 depending on size",
    note: "+$10–$20 for SUV / Truck",
    popular: false,
    features: [
      "Full hand wash — body & panels",
      "Wheel & tire scrub + dressing",
      "Window & mirror cleaning",
      "Exterior trim wipe-down",
      "Quick interior vacuum",
    ],
  },
  {
    badge: "Full Interior",
    price: "100",
    range: "$100 – $140 depending on size",
    note: "+$20–$30 for SUV / Truck",
    popular: true,
    features: [
      "Deep vacuum — seats & carpets",
      "Shampoo & steam clean",
      "Dashboard & console detail",
      "Door panels & trim cleaned",
      "Windows cleaned inside",
      "Air freshener & deodorize",
    ],
  },
  {
    badge: "Full Detail",
    price: "160",
    range: "$160+ depending on size & condition",
    note: "+$20–$30 for SUV / Truck",
    popular: false,
    features: [
      "Everything in Exterior",
      "Everything in Full Interior",
      "Clay bar treatment",
      "Wax & paint sealant",
      "Tire shine & trim protect",
      "Best value for full refresh",
    ],
  },
];

const addons = [
  { icon: "⚙️", name: "Engine Bay Clean", price: "+$50" },
  { icon: "🐾", name: "Pet Hair Removal", price: "+$30" },
  { icon: "🛡️", name: "Ceramic Coating", price: "Custom" },
  { icon: "✨", name: "Paint Correction", price: "Custom" },
  { icon: "🪟", name: "Headlight Restore", price: "+$40" },
  { icon: "🌬️", name: "Ozone Treatment", price: "+$35" },
];

export default function Pricing() {
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
    <section id="pricing" ref={ref} style={{ background: "#f5f4f0", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
          textTransform: "uppercase", color: "#2563eb", marginBottom: 12
        }}>Pricing</div>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e", marginBottom: 14
        }}>Simple, Honest Pricing</h2>
        <p style={{ fontSize: ".95rem", color: "#888", lineHeight: 1.72, maxWidth: 480, margin: "0 auto" }}>
          No hidden fees. Prices shown are for standard sedans. Add $20–$30 for SUVs and trucks.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20, maxWidth: 1060, margin: "0 auto"
      }}>
        {plans.map((p) => (
          <div key={p.badge} className="reveal" style={{
            borderRadius: 22,
            padding: "42px 32px",
            background: p.popular ? "#2563eb" : "#fff",
            position: "relative",
            boxShadow: p.popular ? "0 20px 60px rgba(37,99,235,0.25)" : "0 2px 24px rgba(26,26,46,0.06)",
            border: p.popular ? "none" : "1px solid rgba(26,26,46,0.08)"
          }}>
            {p.popular && (
              <div style={{
                position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)",
                background: "#1a1a2e", color: "#fff",
                fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                padding: "5px 18px", borderRadius: 100, whiteSpace: "nowrap"
              }}>Most Popular</div>
            )}
            <div style={{
              fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: ".1em",
              color: p.popular ? "rgba(255,255,255,0.65)" : "#2563eb",
              marginBottom: 14
            }}>{p.badge}</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "3.5rem", fontWeight: 900,
              color: p.popular ? "#fff" : "#1a1a2e",
              letterSpacing: "-2.5px", lineHeight: 1, marginBottom: 6
            }}>
              <sup style={{ fontSize: "1.3rem", verticalAlign: "super" }}>$</sup>{p.price}
            </div>
            <div style={{ fontSize: ".8rem", color: p.popular ? "rgba(255,255,255,0.55)" : "#999", marginBottom: 6 }}>{p.range}</div>
            <div style={{ fontSize: ".78rem", color: p.popular ? "rgba(255,255,255,0.6)" : "#2563eb", fontWeight: 600, marginBottom: 28 }}>{p.note}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, padding: 0 }}>
              {p.features.map((f) => (
                <li key={f} style={{
                  fontSize: ".875rem",
                  color: p.popular ? "rgba(255,255,255,0.88)" : "#444",
                  display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 400
                }}>
                  <span style={{
                    flexShrink: 0, marginTop: 2,
                    color: p.popular ? "rgba(255,255,255,0.7)" : "#2563eb",
                    fontSize: ".8rem", fontWeight: 700
                  }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#contact" style={{
              display: "block", textAlign: "center", padding: "13px", borderRadius: 100,
              fontSize: ".9rem", fontWeight: 600, textDecoration: "none",
              background: p.popular ? "#fff" : "#1a1a2e",
              color: p.popular ? "#2563eb" : "#fff",
            }}>Book This</a>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="reveal" style={{
        maxWidth: 1060, margin: "32px auto 0",
        background: "#fff", borderRadius: 20,
        padding: "32px 36px", border: "1px solid rgba(26,26,46,0.08)"
      }}>
        <div style={{
          fontFamily: "'Poppins', sans-serif", fontSize: "1rem", fontWeight: 700,
          color: "#1a1a2e", marginBottom: 20
        }}>Add-On Services</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {addons.map((a) => (
            <div key={a.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f5f4f0", border: "1px solid rgba(26,26,46,0.08)",
              borderRadius: 100, padding: "9px 20px"
            }}>
              <span style={{ fontSize: "1rem" }}>{a.icon}</span>
              <span style={{ fontSize: ".85rem", fontWeight: 500, color: "#1a1a2e" }}>{a.name}</span>
              <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#2563eb", marginLeft: 4 }}>{a.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
