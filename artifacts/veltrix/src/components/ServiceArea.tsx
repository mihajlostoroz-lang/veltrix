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
    <div ref={ref} style={{ background: "#0f172a", padding: "72px 5%", textAlign: "center" }}>
      <h3 className="reveal" style={{
        fontFamily: "'Syne', sans-serif", fontSize: "1.8rem", fontWeight: 800,
        color: "#fff", marginBottom: 12, letterSpacing: "-0.5px"
      }}>
        📍 We Serve Union County &amp; Surrounding Areas
      </h3>
      <p className="reveal" style={{ fontSize: ".95rem", color: "#94a3b8", maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
        Based in Union County, NJ — we travel up to 10 miles to bring the detail to you. No need to leave your home or office.
      </p>
      <div className="reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, maxWidth: 780, margin: "0 auto" }}>
        {cities.map((city) => (
          <span key={city} style={{
            background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)",
            color: "#93c5fd", borderRadius: 50, padding: "8px 20px",
            fontSize: ".82rem", fontWeight: 500
          }}>{city}</span>
        ))}
      </div>
    </div>
  );
}
