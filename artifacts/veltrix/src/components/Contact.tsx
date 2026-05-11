import { useEffect, useRef } from "react";
import BookingScheduler from "./BookingScheduler";

export default function Contact() {
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
    <section id="contact" ref={ref} style={{ background: "#f5f8ff", padding: "96px 5%" }}>
      <div className="contact-inner-grid" style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.1fr",
        gap: 64, alignItems: "start"
      }}>
        {/* Left info */}
        <div className="reveal">
          <div style={{
            display: "inline-block", fontSize: ".75rem", fontWeight: 700,
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "#2563eb", background: "#dbeafe",
            padding: "6px 16px", borderRadius: 50, marginBottom: 14
          }}>Book Online</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
            fontWeight: 800, letterSpacing: "-1.2px",
            color: "#0f172a", marginBottom: 14
          }}>Schedule Your Detail</h2>
          <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, marginBottom: 38 }}>
            Pick your service, choose a date and time, and we'll come to you. No hassle, no travel — just a showroom-clean car.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
            {[
              { icon: "📞", label: "Phone", val: "(862) 394-3198", href: "tel:8623943198" },
              { icon: "📍", label: "Service Area", val: "Union County, NJ & 10-Mile Radius", href: undefined },
              { icon: "🕐", label: "Hours", val: "Mon–Sat: 8am–6pm", href: undefined },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 15,
                  background: "#dbeafe", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.3rem", flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: ".72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: ".92rem", fontWeight: 500, color: "#0f172a", textDecoration: "none" }}>{item.val}</a>
                  ) : (
                    <span style={{ fontSize: ".92rem", fontWeight: 500, color: "#0f172a" }}>{item.val}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "20px 24px",
            border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12
          }}>
            {[
              { icon: "✅", text: "Fully insured & certified" },
              { icon: "⭐", text: "5-star rated on Google" },
              { icon: "🔒", text: "No payment until service is complete" },
              { icon: "🚐", text: "We come directly to you" },
            ].map((t) => (
              <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".85rem", color: "#1e293b", fontWeight: 300 }}>
                <span>{t.icon}</span> {t.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            {[
              { label: "Instagram", href: "https://www.instagram.com/veltrix.mobile.detail", icon: "📸" },
              { label: "Facebook", href: "#", icon: "👥" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#ffffff", border: "1.5px solid #e2e8f0",
                borderRadius: 50, padding: "10px 20px",
                fontSize: ".85rem", fontWeight: 500, color: "#0f172a",
                textDecoration: "none"
              }}>
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Booking Scheduler */}
        <div className="reveal" style={{
          background: "#ffffff", borderRadius: 20,
          padding: "42px 38px", boxShadow: "0 8px 40px rgba(37,99,235,0.12)", border: "1px solid #e2e8f0"
        }}>
          <BookingScheduler />
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .contact-inner-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .form-row2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
