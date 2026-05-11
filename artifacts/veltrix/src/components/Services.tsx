import { useEffect, useRef } from "react";

const services = [
  {
    icon: "🚿", title: "Exterior Wash",
    desc: "Full hand wash of the entire body, wheels, tires, and all glass surfaces. Includes tire dressing and a streak-free window finish.",
    note: "Starting at $40"
  },
  {
    icon: "🪣", title: "Interior Detail",
    desc: "Deep vacuum, steam cleaning, full interior wipe-down, door panels, dashboard, and thorough carpet & upholstery shampoo.",
    note: "Starting at $100"
  },
  {
    icon: "✨", title: "Full Detail",
    desc: "Our most complete package — interior + exterior combined. Every surface cleaned, conditioned, and protected inside and out.",
    note: "Starting at $160"
  },
  {
    icon: "⚙️", title: "Engine Bay Cleaning",
    desc: "Safe, thorough degreasing and rinse of the engine bay. Makes your engine look fresh and helps spot potential leaks.",
    note: "Add-on: $50"
  },
  {
    icon: "🐾", title: "Pet Hair Removal",
    desc: "Specialized tools and techniques to remove stubborn pet hair from seats, carpets and all fabric surfaces.",
    note: "Add-on: +$30"
  },
  {
    icon: "💎", title: "Paint Correction & Ceramic",
    desc: "Remove swirl marks, light scratches and oxidation. Optional ceramic coating for long-lasting protection and gloss.",
    note: "Custom Quote"
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
    <section id="services" ref={ref} style={{ background: "#f5f8ff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          display: "inline-block", fontSize: ".75rem", fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2563eb", background: "#dbeafe",
          padding: "6px 16px", borderRadius: 50, marginBottom: 14
        }}>What We Do</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          fontWeight: 800, letterSpacing: "-1.2px",
          color: "#0f172a", marginBottom: 14
        }}>Our Services</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          From a quick exterior shine to a deep full-detail — we bring professional-grade results directly to your driveway.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
        gap: 22, maxWidth: 1200, margin: "0 auto"
      }}>
        {services.map((s) => (
          <div key={s.title} className="reveal svc-card" style={{
            background: "#ffffff", borderRadius: 20,
            padding: "36px 30px", border: "1px solid #e2e8f0",
            transition: "all .3s", position: "relative", overflow: "hidden"
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "#eff6ff", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.6rem", marginBottom: 20
            }}>{s.icon}</div>
            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700,
              color: "#0f172a", marginBottom: 10
            }}>{s.title}</h3>
            <p style={{ fontSize: ".875rem", color: "#64748b", lineHeight: 1.68, fontWeight: 300 }}>{s.desc}</p>
            <span style={{
              display: "inline-block", marginTop: 12,
              fontSize: ".75rem", fontWeight: 600, color: "#2563eb",
              background: "#dbeafe", padding: "4px 12px", borderRadius: 50
            }}>{s.note}</span>
          </div>
        ))}
      </div>

      <style>{`
        .svc-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563eb, #93c5fd);
          opacity: 0;
          transition: opacity .3s;
        }
        .svc-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 8px 40px rgba(37,99,235,0.12);
          border-color: transparent !important;
        }
        .svc-card:hover::after { opacity: 1; }
      `}</style>
    </section>
  );
}
