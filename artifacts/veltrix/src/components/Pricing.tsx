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
    <section id="pricing" ref={ref} style={{ background: "#ffffff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          display: "inline-block", fontSize: ".75rem", fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2563eb", background: "#dbeafe",
          padding: "6px 16px", borderRadius: 50, marginBottom: 14
        }}>Transparent Pricing</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          fontWeight: 800, letterSpacing: "-1.2px",
          color: "#0f172a", marginBottom: 14
        }}>Simple, Honest Prices</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          No hidden fees. Prices shown are for standard sedans. Add $20–$30 for SUVs and trucks.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 28, maxWidth: 1060, margin: "0 auto"
      }}>
        {plans.map((p) => (
          <div key={p.badge} className="reveal" style={{
            borderRadius: 20,
            padding: "42px 34px",
            border: p.popular ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
            background: p.popular ? "linear-gradient(155deg, #eff6ff 0%, #fff 100%)" : "#fff",
            boxShadow: p.popular ? "0 16px 60px rgba(37,99,235,0.16)" : "none",
            transition: "all .3s",
            position: "relative"
          }}>
            {p.popular && (
              <div style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                background: "#2563eb", color: "#fff",
                fontSize: ".72rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
                padding: "5px 20px", borderRadius: 50, whiteSpace: "nowrap"
              }}>Most Popular</div>
            )}
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: ".8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#2563eb", marginBottom: 10 }}>
              {p.badge}
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: "3rem", fontWeight: 800,
              color: "#0f172a", letterSpacing: "-2px", lineHeight: 1, marginBottom: 4
            }}>
              <sup style={{ fontSize: "1.4rem", verticalAlign: "super" }}>$</sup>{p.price}
            </div>
            <div style={{ fontSize: ".82rem", color: "#64748b", marginBottom: 6 }}>{p.range}</div>
            <div style={{ fontSize: ".78rem", color: "#2563eb", fontWeight: 500, marginBottom: 26 }}>{p.note}</div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 11, marginBottom: 32, padding: 0 }}>
              {p.features.map((f) => (
                <li key={f} style={{ fontSize: ".875rem", color: "#1e293b", display: "flex", alignItems: "center", gap: 10, fontWeight: 300 }}>
                  <span style={{
                    width: 22, height: 22, flexShrink: 0,
                    background: "#dbeafe", color: "#2563eb",
                    borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".68rem", fontWeight: 800
                  }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#contact" style={{
              display: "block", textAlign: "center", padding: 13, borderRadius: 50,
              fontSize: ".9rem", fontWeight: 500, textDecoration: "none",
              background: p.popular ? "#2563eb" : "transparent",
              color: p.popular ? "#fff" : "#0f172a",
              border: p.popular ? "none" : "1.5px solid #e2e8f0",
              boxShadow: p.popular ? "0 6px 24px rgba(37,99,235,0.28)" : "none"
            }}>Book This</a>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="reveal" style={{
        maxWidth: 1060, margin: "40px auto 0",
        background: "#f5f8ff", borderRadius: 20,
        padding: "36px 40px", border: "1px solid #e2e8f0"
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700,
          color: "#0f172a", marginBottom: 22
        }}>⚡ Add-On Services</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          {addons.map((a) => (
            <div key={a.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#ffffff", border: "1px solid #e2e8f0",
              borderRadius: 50, padding: "10px 20px"
            }}>
              <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
              <span style={{ fontSize: ".85rem", fontWeight: 500, color: "#0f172a" }}>{a.name}</span>
              <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#2563eb", marginLeft: 4 }}>{a.price}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 560px) {
          .pricing-addons-wrap { padding: 28px 20px !important; }
        }
      `}</style>
    </section>
  );
}
