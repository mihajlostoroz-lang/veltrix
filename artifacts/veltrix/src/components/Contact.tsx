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
    <section id="contact" ref={ref} style={{ background: "#fff", padding: "96px 5%" }}>
      <div className="contact-inner-grid" style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1.1fr",
        gap: 64, alignItems: "start"
      }}>
        {/* Left info */}
        <div className="reveal">
          <div style={{
            fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
            textTransform: "uppercase", color: "#2563eb", marginBottom: 14
          }}>Book Online</div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e", marginBottom: 16
          }}>Schedule Your Detail</h2>
          <p style={{ fontSize: ".95rem", color: "#888", lineHeight: 1.75, fontWeight: 400, marginBottom: 40 }}>
            Pick your service, choose a date and time, and we'll come to you. No hassle, no travel — just a showroom-clean car.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
            {[
              { icon: "📞", label: "Phone", val: "(908) 499-6895", href: "tel:9084996895" },
              { icon: "📍", label: "Service Area", val: "Union County, NJ & 10-Mile Radius", href: undefined },
              { icon: "🕐", label: "Hours", val: "Saturdays & Sundays", href: undefined },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "#f5f4f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem", flexShrink: 0
                }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: ".7rem", color: "#bbb", textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ fontSize: ".92rem", fontWeight: 600, color: "#1a1a2e", textDecoration: "none" }}>{item.val}</a>
                  ) : (
                    <span style={{ fontSize: ".92rem", fontWeight: 500, color: "#1a1a2e" }}>{item.val}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: "#f5f4f0", borderRadius: 18, padding: "22px 26px",
            border: "1px solid rgba(26,26,46,0.06)",
            display: "flex", flexDirection: "column", gap: 13, marginBottom: 24
          }}>
            {[
              { icon: "✅", text: "Fully insured & certified" },
              { icon: "⭐", text: "5-star rated on Google" },
              { icon: "🔒", text: "No payment until service is complete" },
              { icon: "🚐", text: "We come directly to you" },
            ].map((t) => (
              <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: ".88rem", color: "#444", fontWeight: 400 }}>
                <span>{t.icon}</span> {t.text}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Instagram", href: "https://www.instagram.com/veltrix.mobile.detail", icon: "📸" },
              { label: "Facebook", href: "#", icon: "👥" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#f5f4f0", border: "1px solid rgba(26,26,46,0.1)",
                borderRadius: 100, padding: "10px 20px",
                fontSize: ".85rem", fontWeight: 500, color: "#1a1a2e",
                textDecoration: "none"
              }}>
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right: Booking Scheduler */}
        <div className="reveal" style={{
          background: "#f5f4f0", borderRadius: 22,
          padding: "40px 36px",
          border: "1px solid rgba(26,26,46,0.08)"
        }}>
          <BookingScheduler />
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .contact-inner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
