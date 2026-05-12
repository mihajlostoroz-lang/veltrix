import { useState } from "react";

const NAV_LINKS = ["Services", "Pricing", "Gallery", "Reviews", "Contact"];

const SERVICES = [
  { icon: "⬡", title: "Exterior Wash", price: "$40+", time: "1 hr", desc: "Full hand wash, wheels, tires, all glass surfaces, tire dressing, and streak-free window finish.", tag: "Most Booked" },
  { icon: "⬡", title: "Interior Detail", price: "$100+", time: "4 hrs", desc: "Deep vacuum, steam cleaning, full wipe-down, door panels, dashboard, and carpet shampoo.", tag: "" },
  { icon: "⬡", title: "Full Detail", price: "$160+", time: "5 hrs", desc: "Our complete package — interior + exterior combined. Every surface cleaned and protected.", tag: "Best Value" },
  { icon: "⬡", title: "Engine Bay Cleaning", price: "+$50", time: "2 hrs", desc: "Safe degreasing and rinse of the engine bay. Looks fresh and helps spot potential issues.", tag: "Add-on" },
  { icon: "⬡", title: "Pet Hair Removal", price: "+$30", time: "2 hrs", desc: "Specialized techniques to remove stubborn pet hair from all fabric surfaces completely.", tag: "Add-on" },
  { icon: "⬡", title: "Paint Correction", price: "Quote", time: "Varies", desc: "Remove swirl marks and oxidation. Optional ceramic coating for long-lasting protection.", tag: "Premium" },
];

const REVIEWS = [
  { text: "Amazing service! They came right to my house and my car looks brand new. The interior was completely transformed.", name: "Michael T.", loc: "Elizabeth, NJ", rating: 5 },
  { text: "I had a ton of pet hair from my golden retriever and they got every single strand out. Super professional!", name: "Sarah K.", loc: "Summit, NJ", rating: 5 },
  { text: "Best mobile detailing in Union County. Came to my office, did a full detail, and my car looked showroom fresh.", name: "David R.", loc: "Westfield, NJ", rating: 5 },
];

const CITIES = ["Elizabeth", "Union", "Westfield", "Springfield", "Summit", "Linden", "Roselle", "Cranford", "Clark", "Rahway"];

export function ModernEditorial() {
  return (
    <div style={{ fontFamily: "'Poppins', system-ui, sans-serif", background: "#f5f4f0", color: "#1a1a2e", overflowX: "hidden" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(245,244,240,0.92)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%", borderBottom: "1px solid rgba(26,26,46,0.08)" }}>
        <a href="#" style={{ fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.5px", textDecoration: "none", color: "#1a1a2e", padding: "16px 0" }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
        </a>
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" style={{ fontSize: ".85rem", color: "#666", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="tel:8623943198" style={{ fontSize: ".82rem", fontWeight: 600, color: "#1a1a2e", textDecoration: "none" }}>(862) 394-3198</a>
          <a href="#" style={{ background: "#2563eb", color: "#fff", padding: "9px 20px", borderRadius: 100, fontSize: ".82rem", fontWeight: 600, textDecoration: "none" }}>Book Now</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 72, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid rgba(26,26,46,0.1)", borderRadius: 100, padding: "7px 16px", marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: ".75rem", fontWeight: 600, color: "#444", letterSpacing: ".03em" }}>Available this weekend in Union County</span>
            </div>
            <h1 style={{ fontSize: "clamp(3rem, 5.5vw, 5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-3px", color: "#1a1a2e", marginBottom: 24 }}>
              We bring the<br />
              detail to<br />
              <span style={{ color: "#2563eb", fontStyle: "italic" }}>your door.</span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#666", lineHeight: 1.8, maxWidth: 400, marginBottom: 36, fontWeight: 400 }}>
              Professional mobile detailing in Union County, NJ. Skip the drive — we come to your home or office and make it spotless.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#" style={{ background: "#1a1a2e", color: "#fff", padding: "14px 30px", borderRadius: 100, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>Book a Detail</a>
              <a href="#" style={{ background: "#fff", color: "#1a1a2e", border: "1px solid rgba(26,26,46,0.15)", padding: "14px 30px", borderRadius: 100, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>View Pricing</a>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 44, paddingTop: 36, borderTop: "1px solid rgba(26,26,46,0.1)" }}>
              {[["500+", "Happy clients"], ["5.0★", "Google rating"], ["3+", "Years serving NJ"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.5px", color: "#1a1a2e" }}>{n}</div>
                  <div style={{ fontSize: ".75rem", color: "#888", marginTop: 3, fontWeight: 400 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "28px", boxShadow: "0 2px 24px rgba(26,26,46,0.07)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🚗</div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#1a1a2e", marginBottom: 4 }}>Veltrix Mobile Detailing</div>
              <div style={{ fontSize: ".8rem", color: "#888", marginBottom: 20 }}>Union County, NJ · 10-Mile Radius</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Fully Insured", "5-Star Rated", "No Prepayment", "We Come to You"].map(b => (
                  <span key={b} style={{ background: "#f5f4f0", border: "1px solid rgba(26,26,46,0.08)", borderRadius: 100, padding: "5px 12px", fontSize: ".72rem", fontWeight: 600, color: "#444" }}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { icon: "📞", label: "Phone", val: "(862) 394-3198" },
                { icon: "🕐", label: "Hours", val: "Sat & Sun" },
                { icon: "📍", label: "Area", val: "Union County" },
                { icon: "⭐", label: "Rating", val: "5.0 on Google" },
              ].map(c => (
                <div key={c.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 1px 12px rgba(26,26,46,0.05)" }}>
                  <div style={{ fontSize: "1.3rem", marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: ".68rem", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 3 }}>{c.label}</div>
                  <div style={{ fontWeight: 600, fontSize: ".82rem", color: "#1a1a2e" }}>{c.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ background: "#1a1a2e", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: 12 }}>What We Do</div>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px", color: "#fff" }}>Our Services</h2>
            </div>
            <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.4)", maxWidth: 320, lineHeight: 1.7 }}>From a quick exterior shine to a complete full-detail — professional results at your driveway.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {SERVICES.map(s => (
              <div key={s.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "rgba(255,255,255,0.12)" }}>{s.icon}</div>
                  {s.tag && <span style={{ fontSize: ".65rem", fontWeight: 700, color: "#3b82f6", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 100, padding: "3px 10px", letterSpacing: ".06em" }}>{s.tag}</span>}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: ".95rem", color: "#fff", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 16 }}>{s.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontWeight: 700, fontSize: ".9rem", color: "#3b82f6" }}>{s.price}</span>
                  <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,0.25)" }}>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: "#f5f4f0", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e" }}>Simple, Honest Pricing</h2>
            <p style={{ fontSize: ".95rem", color: "#888", marginTop: 12 }}>No hidden fees. Prices shown for standard sedans. Add $20–$30 for SUVs & trucks.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {[
              { name: "Exterior Wash", price: "40", subtitle: "Starting price, sedan", popular: false, color: "#f5f4f0", features: ["Hand wash — body & panels", "Wheel & tire detail", "Window cleaning", "Tire dressing", "Quick interior vacuum"] },
              { name: "Full Interior", price: "100", subtitle: "Starting price, sedan", popular: true, color: "#2563eb", features: ["Deep vacuum & shampoo", "Steam clean carpets", "Dashboard & console detail", "Door panels & trim", "Windows inside", "Air freshener"] },
              { name: "Full Detail", price: "160", subtitle: "Best value package", popular: false, color: "#f5f4f0", features: ["Everything in Exterior", "Everything in Interior", "Clay bar treatment", "Wax & paint sealant", "Tire shine & protect"] },
            ].map(p => (
              <div key={p.name} style={{ background: p.popular ? "#2563eb" : "#fff", borderRadius: 20, padding: "36px 28px", position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#1a1a2e", color: "#fff", fontSize: ".62rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "5px 14px", borderRadius: 100, whiteSpace: "nowrap" }}>Most Popular</div>}
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: p.popular ? "rgba(255,255,255,0.6)" : "#2563eb", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>{p.name}</div>
                <div style={{ fontSize: "3.5rem", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, color: p.popular ? "#fff" : "#1a1a2e", marginBottom: 6 }}>
                  <sup style={{ fontSize: "1.2rem", verticalAlign: "super" }}>$</sup>{p.price}
                </div>
                <div style={{ fontSize: ".75rem", color: p.popular ? "rgba(255,255,255,0.5)" : "#aaa", marginBottom: 28 }}>{p.subtitle}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: ".85rem", color: p.popular ? "rgba(255,255,255,0.85)" : "#555", display: "flex", gap: 10 }}>
                      <span style={{ color: p.popular ? "rgba(255,255,255,0.6)" : "#2563eb", flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: 100, fontSize: ".85rem", fontWeight: 600, textDecoration: "none", background: p.popular ? "#fff" : "#1a1a2e", color: p.popular ? "#2563eb" : "#fff" }}>Book This</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ background: "#fff", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e" }}>What Our Clients Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <div key={r.name} style={{ background: i === 1 ? "#1a1a2e" : "#f5f4f0", borderRadius: 20, padding: 28 }}>
                <div style={{ color: "#f59e0b", fontSize: ".9rem", marginBottom: 16, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: ".9rem", color: i === 1 ? "rgba(255,255,255,0.7)" : "#555", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 1 ? "rgba(255,255,255,0.1)" : "rgba(26,26,46,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".9rem" }}>👤</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".85rem", color: i === 1 ? "#fff" : "#1a1a2e" }}>{r.name}</div>
                    <div style={{ fontSize: ".72rem", color: i === 1 ? "rgba(255,255,255,0.35)" : "#999", marginTop: 1 }}>{r.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#f5f4f0", border: "1px solid rgba(26,26,46,0.08)", borderRadius: 100, padding: "12px 22px" }}>
              <span style={{ color: "#f59e0b", fontSize: ".9rem" }}>★★★★★</span>
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: "#1a1a2e" }}>5.0 on Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section style={{ background: "#f5f4f0", padding: "72px 5%", borderTop: "1px solid rgba(26,26,46,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Service Area</div>
          <h3 style={{ fontWeight: 800, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-1px", color: "#1a1a2e", marginBottom: 10 }}>We Serve Union County & Surrounding Areas</h3>
          <p style={{ fontSize: ".9rem", color: "#888", marginBottom: 28, lineHeight: 1.7 }}>Based in Union County — we travel up to 10 miles to bring the detail to you.</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {CITIES.map(c => (
              <span key={c} style={{ background: "#fff", border: "1px solid rgba(26,26,46,0.1)", borderRadius: 100, padding: "7px 18px", fontSize: ".82rem", fontWeight: 500, color: "#555" }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a1a2e", padding: "44px 5%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>Velt<span style={{ color: "#3b82f6" }}>rix</span></div>
        <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} Veltrix Mobile Detailing · Union County, NJ</div>
        <a href="tel:8623943198" style={{ fontSize: ".85rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>(862) 394-3198</a>
      </footer>
    </div>
  );
}
