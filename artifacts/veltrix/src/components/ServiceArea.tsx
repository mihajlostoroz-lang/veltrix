import { useEffect, useRef } from "react";

const cities = [
  "Elizabeth", "Union", "Westfield", "Springfield", "Summit",
  "Linden", "Roselle", "Cranford", "Clark", "Rahway",
  "Scotch Plains", "Plainfield", "Kenilworth", "Hillside", "Roselle Park"
];

export default function ServiceArea() {
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref} style={{ background: "#1a1a2e", padding: "80px 5%", textAlign: "center" }}>
      <div className="reveal" style={{
        fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
        textTransform: "uppercase", color: "#3b82f6", marginBottom: 14
      }}>Service Area</div>
      <h3 className="reveal" style={{
        fontFamily: "'Poppins', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
        fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: "-1px"
      }}>
        Serving Union County &amp; Surrounding Areas
      </h3>
      <p className="reveal" style={{
        fontSize: ".92rem", color: "rgba(255,255,255,0.4)",
        maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.75
      }}>
        Based in Union County, NJ — we travel up to 10 miles to bring the detail to you. No need to leave your home or office.
      </p>
      <div className="reveal" style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: 10, maxWidth: 780, margin: "0 auto"
      }}>
        {cities.map((city) => (
          <span key={city} style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
            borderRadius: 100, padding: "7px 18px",
            fontSize: ".82rem", fontWeight: 500
          }}>{city}</span>
        ))}
      </div>
    </div>
  );
}
