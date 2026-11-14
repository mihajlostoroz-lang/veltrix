import { useState } from "react";

const NAV_LINKS = ["Services", "Pricing", "Gallery", "Reviews", "Contact"];

const SERVICES = [
  { num: "01", title: "Exterior Wash", price: "$40+", desc: "Full hand wash, wheels, tires, all glass. Tire dressing and streak-free finish." },
  { num: "02", title: "Interior Detail", price: "$100+", desc: "Deep vacuum, steam cleaning, full wipe-down, shampoo, and deodorize." },
  { num: "03", title: "Full Detail", price: "$160+", desc: "Complete interior + exterior treatment. Every surface cleaned and protected." },
  { num: "04", title: "Engine Bay", price: "+$50", desc: "Safe degreasing and rinse of the engine bay. Professional finish." },
  { num: "05", title: "Pet Hair Removal", price: "+$30", desc: "Specialist tools to remove pet hair from all fabric surfaces completely." },
  { num: "06", title: "Paint Correction", price: "Quote", desc: "Remove swirl marks, scratches, oxidation with optional ceramic coating." },
];

const PLANS = [
  { name: "Exterior", price: "40", from: "Sedan pricing", popular: false, features: ["Hand wash — full body", "Wheel & tire detail", "Window cleaning", "Trim wipe-down", "Tire dressing"] },
  { name: "Interior", price: "100", from: "Most popular choice", popular: true, features: ["Deep vacuum & shampoo", "Steam clean carpets", "Dashboard & console", "Door panels", "Windows inside", "Air freshener"] },
  { name: "Full Detail", price: "160", from: "Best value package", popular: false, features: ["Everything in Exterior", "Everything in Interior", "Clay bar treatment", "Wax & paint sealant", "Tire shine & protect"] },
];

const REVIEWS = [
  { text: "Amazing service! They came right to my house and my car looks brand new. The interior was completely transformed.", name: "Michael T.", loc: "Elizabeth, NJ" },
  { text: "Super professional and on time. They got every single strand of pet hair out. Highly recommend!", name: "Sarah K.", loc: "Summit, NJ" },
  { text: "Best mobile detailing in Union County. My car looked showroom fresh. Will be booking monthly.", name: "David R.", loc: "Westfield, NJ" },
];

export function DarkPremium() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#08080d", color: "#fff", overflowX: "hidden" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,8,13,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 5%" }}>
        <div style={{ fontWeight: 900, fontSize: "1.3rem", letterSpacing: "-0.5px" }}>
          VELT<span style={{ color: "#3b82f6" }}>RIX</span>
        </div>
        <div style={{ display: "flex", gap: 36 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.45)", textDecoration: "none", fontWeight: 500, letterSpacing: ".03em" }}>{l}</a>
          ))}
        </div>
        <a href="#" style={{ background: "#3b82f6", color: "#fff", padding: "10px 22px", borderRadius: 6, fontSize: ".82rem", fontWeight: 700, textDecoration: "none", letterSpacing: ".03em" }}>Book Now</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: ".7rem", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 28, border: "1px solid rgba(59,130,246,0.25)", borderRadius: 4, padding: "7px 14px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
            Mobile Detailing · Union County NJ
          </div>
          <h1 style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-4px", marginBottom: 28 }}>
            <span style={{ display: "block" }}>SHOWROOM</span>
            <span style={{ display: "block", color: "#3b82f6" }}>CLEAN.</span>
          </h1>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: 36, maxWidth: 400 }}>
                Professional mobile detailing at your home or office. No travel, no waiting — premium results delivered directly to you.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="#" style={{ background: "#3b82f6", color: "#fff", padding: "15px 30px", borderRadius: 6, fontSize: ".9rem", fontWeight: 700, textDecoration: "none" }}>Book a Detail</a>
                <a href="#" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "15px 30px", borderRadius: 6, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>View Pricing</a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { n: "500+", l: "Happy Clients", s: "Union County & beyond" },
                { n: "5.0★", l: "Google Rating", s: "Consistent 5-star reviews" },
                { n: "10mi", l: "Service Radius", s: "We come to you" },
              ].map(s => (
                <div key={s.l} style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-1px", color: "#3b82f6", minWidth: 60 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: ".88rem" }}>{s.l}</div>
                    <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "96px 5%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>Services</div>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px" }}>What We Offer</h2>
            </div>
            <a href="#" style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.4)", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 2 }}>Book any service →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 0 }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} style={{ padding: "28px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderLeft: i % 2 !== 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ fontSize: ".68rem", color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: ".08em" }}>{s.num}</span>
                  <span style={{ fontSize: ".78rem", fontWeight: 700, color: "#3b82f6" }}>{s.price}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: "96px 5%", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px" }}>Transparent Rates</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ border: `1px solid ${p.popular ? "#3b82f6" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, padding: "36px 28px", position: "relative", background: p.popular ? "rgba(59,130,246,0.06)" : "transparent" }}>
                {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "#fff", fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 50, whiteSpace: "nowrap" }}>Most Popular</div>}
                <div style={{ fontSize: ".68rem", fontWeight: 700, color: p.popular ? "#3b82f6" : "rgba(255,255,255,0.3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>{p.name}</div>
                <div style={{ fontSize: "3.2rem", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 6 }}>
                  <sup style={{ fontSize: "1.2rem", verticalAlign: "super" }}>$</sup>{p.price}
                </div>
                <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.3)", marginBottom: 28 }}>{p.from}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.55)", display: "flex", gap: 10 }}>
                      <span style={{ color: "#3b82f6", flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ display: "block", textAlign: "center", padding: 12, borderRadius: 6, fontSize: ".85rem", fontWeight: 600, textDecoration: "none", background: p.popular ? "#3b82f6" : "transparent", color: p.popular ? "#fff" : "rgba(255,255,255,0.5)", border: p.popular ? "none" : "1px solid rgba(255,255,255,0.12)" }}>Book This</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "96px 5%", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px" }}>Client Feedback</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 28, background: "rgba(255,255,255,0.02)" }}>
                <div style={{ color: "#f59e0b", fontSize: ".9rem", marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: ".88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 20 }}>"{r.text}"</p>
                <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{r.name}</div>
                <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{r.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 5%", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-2px", marginBottom: 20 }}>Ready for a<br /><span style={{ color: "#3b82f6" }}>spotless ride?</span></h2>
          <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,0.4)", marginBottom: 28, lineHeight: 1.75 }}>Book online or call us — we'll come to you anywhere in Union County.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <a href="#" style={{ background: "#3b82f6", color: "#fff", padding: "15px 32px", borderRadius: 6, fontSize: ".9rem", fontWeight: 700, textDecoration: "none" }}>Book a Detail</a>
            <a href="tel:9084996895" style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "15px 32px", borderRadius: 6, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>(908) 499-6895</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 5%", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-.5px" }}>VELT<span style={{ color: "#3b82f6" }}>RIX</span></div>
        <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.2)" }}>© {new Date().getFullYear()} Veltrix Mobile Detailing. All rights reserved.</div>
        <a href="#" style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.2)", textDecoration: "none" }}>Owner Login</a>
      </footer>
    </div>
  );
}
