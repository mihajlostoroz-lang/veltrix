import { useEffect, useRef } from "react";

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);

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

  const stats = [
    { num: "500", suffix: "+", label: "Happy Clients" },
    { num: "3", suffix: "+", label: "Years in Business" },
    { num: "5.0", suffix: "★", label: "Google Rating" },
    { num: "10", suffix: "mi", label: "Service Radius" },
  ];

  return (
    <div ref={ref} style={{ background: "#1a1a2e", padding: "44px 5%" }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 28
      }}>
        {stats.map((s) => (
          <div key={s.label} className="reveal" style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Poppins', sans-serif", fontSize: "2.4rem", fontWeight: 800,
              color: "#fff", letterSpacing: "-1.5px"
            }}>
              {s.num}<span style={{ color: "#2563eb" }}>{s.suffix}</span>
            </div>
            <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,0.4)", marginTop: 5, letterSpacing: ".03em" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
