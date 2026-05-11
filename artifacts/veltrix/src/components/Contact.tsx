import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "", vehicle: "", message: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #e2e8f0", borderRadius: 12,
    padding: "12px 16px", fontSize: ".9rem",
    fontFamily: "'DM Sans', sans-serif",
    color: "#0f172a", background: "#ffffff", outline: "none",
    width: "100%", boxSizing: "border-box"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: ".78rem", fontWeight: 600, color: "#64748b",
    letterSpacing: ".04em", textTransform: "uppercase", display: "block", marginBottom: 6
  };

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
          }}>Get in Touch</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
            fontWeight: 800, letterSpacing: "-1.2px",
            color: "#0f172a", marginBottom: 14
          }}>Book Your Detail</h2>
          <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, marginBottom: 38 }}>
            Ready for a showroom-clean car? Reach out and we'll get you scheduled — we come to you.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: "📞", label: "Phone", val: "(862) 394-3198", href: "tel:8623943198" },
              { icon: "📍", label: "Service Area", val: "Union County, NJ & 10-Mile Radius", href: undefined },
              { icon: "🕐", label: "Hours", val: "Mon–Sat: 8am–7pm · Sun: 9am–5pm", href: undefined },
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

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
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

        {/* Right form */}
        <div className="reveal" style={{
          background: "#ffffff", borderRadius: 20,
          padding: "42px 38px", boxShadow: "0 8px 40px rgba(37,99,235,0.12)", border: "1px solid #e2e8f0"
        }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
                Booking Request Sent!
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.7 }}>
                Thanks! We'll reach out shortly to confirm your appointment.
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: 28 }}>
                Request a Booking
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row2">
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Name</label>
                    <input required style={inputStyle} placeholder="John Smith" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" required style={inputStyle} placeholder="(555) 000-0000" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={inputStyle} placeholder="you@email.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Service</label>
                  <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}>
                    <option value="">Select a service...</option>
                    <option>Exterior Wash ($40+)</option>
                    <option>Interior Detail ($100+)</option>
                    <option>Full Detail ($160+)</option>
                    <option>Add-on / Other</option>
                    <option>Custom Quote</option>
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Vehicle</label>
                  <input style={inputStyle} placeholder="e.g. 2020 Honda Accord" value={form.vehicle}
                    onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Message / Notes</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 100 }} placeholder="Any special requests or questions?" value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" style={{
                  width: "100%", padding: 15, background: "#2563eb", color: "#fff",
                  border: "none", borderRadius: 50, fontSize: ".95rem", fontWeight: 500,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                  boxShadow: "0 6px 24px rgba(37,99,235,0.28)", marginTop: 8
                }}>
                  Request Booking
                </button>
                <p style={{ textAlign: "center", fontSize: ".78rem", color: "#64748b", marginTop: 12 }}>
                  We'll reach out to confirm within a few hours.
                </p>
              </form>
            </>
          )}
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
