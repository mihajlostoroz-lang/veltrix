import { useState } from "react";

const NAV_LINKS = ["Services", "Pricing", "Gallery", "Reviews", "Contact"];

const SERVICES = [
  { icon: "✦", title: "Exterior Wash", price: "$40+", time: "1 hr", desc: "Full hand wash, wheels, tires, all glass surfaces, tire dressing, and streak-free windows." },
  { icon: "✦", title: "Interior Detail", price: "$100+", time: "4 hrs", desc: "Deep vacuum, steam cleaning, full wipe-down, dashboard, door panels, carpet & upholstery shampoo." },
  { icon: "✦", title: "Full Detail", price: "$160+", time: "5 hrs", desc: "Our most complete package — interior + exterior combined, every surface cleaned and protected." },
  { icon: "✦", title: "Engine Bay Cleaning", price: "+$50", time: "2 hrs", desc: "Safe degreasing and rinse of the engine bay. Looks fresh and helps spot potential leaks." },
  { icon: "✦", title: "Pet Hair Removal", price: "+$30", time: "2 hrs", desc: "Specialized tools to remove stubborn pet hair from seats, carpets, and all fabric surfaces." },
  { icon: "✦", title: "Paint Correction", price: "Quote", time: "Varies", desc: "Remove swirl marks, scratches, oxidation. Optional ceramic coating for long-lasting protection." },
];

const PLANS = [
  { name: "Exterior Wash", from: "$40", features: ["Hand wash — body & panels", "Wheel & tire scrub", "Window cleaning", "Tire dressing"], popular: false },
  { name: "Full Interior", from: "$100", features: ["Deep vacuum & shampoo", "Steam clean carpets", "Dashboard & console", "Windows inside", "Air freshener"], popular: true },
  { name: "Full Detail", from: "$160", features: ["Everything in Exterior", "Everything in Interior", "Clay bar treatment", "Wax & paint sealant", "Best value"], popular: false },
];

const REVIEWS = [
  { text: "Amazing service! They came right to my house and my car looks brand new. The interior was completely transformed — worth every penny.", name: "Michael T.", loc: "Elizabeth, NJ" },
  { text: "I had a ton of pet hair from my golden retriever and they got every single strand out. Super professional and on time. Highly recommend!", name: "Sarah K.", loc: "Summit, NJ" },
  { text: "Best mobile detailing in Union County. Came to my office, did a full detail, and my car looked showroom fresh. Will be booking monthly.", name: "David R.", loc: "Westfield, NJ" },
];

const CITIES = ["Elizabeth", "Union", "Westfield", "Springfield", "Summit", "Linden", "Roselle", "Cranford", "Clark", "Rahway", "Scotch Plains", "Kenilworth"];

export function CleanMinimal() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: "#111", background: "#fff", overflowX: "hidden" }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%" }}>
        <div style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px", padding: "18px 0" }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
        </div>
        <div style={{ display: "flex", gap: 36, listStyle: "none" }}>
          {NAV_LINKS.map(l => (
            <a key={l} href="#" style={{ fontSize: ".85rem", color: "#555", textDecoration: "none", fontWeight: 500 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="tel:8623943198" style={{ fontSize: ".85rem", fontWeight: 600, color: "#111", textDecoration: "none" }}>(862) 394-3198</a>
          <a href="#" style={{ background: "#111", color: "#fff", padding: "9px 20px", borderRadius: 6, fontSize: ".85rem", fontWeight: 600, textDecoration: "none" }}>Book Now</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 5% 80px", background: "#fafafa" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 20 }}>
              <span style={{ width: 20, height: 1, background: "#2563eb", display: "inline-block" }} />
              Mobile Detailing · Union County NJ
            </div>
            <h1 style={{ fontSize: "clamp(2.8rem, 5vw, 4.4rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2.5px", color: "#0a0a0a", marginBottom: 24 }}>
              Your car,<br />
              <span style={{ color: "#2563eb" }}>showroom</span><br />
              clean.
            </h1>
            <p style={{ fontSize: "1.05rem", color: "#666", lineHeight: 1.8, fontWeight: 400, maxWidth: 420, marginBottom: 36 }}>
              Professional mobile detailing at your home or office. No travel, no waiting — we handle everything on-site in Union County, NJ.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="#" style={{ background: "#2563eb", color: "#fff", padding: "14px 28px", borderRadius: 6, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>Book a Detail</a>
              <a href="#" style={{ background: "transparent", color: "#111", border: "1px solid #ddd", padding: "14px 28px", borderRadius: 6, fontSize: ".9rem", fontWeight: 600, textDecoration: "none" }}>See Pricing</a>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 40, paddingTop: 40, borderTop: "1px solid #ebebeb" }}>
              {[["500+", "Happy Clients"], ["5.0★", "Google Rating"], ["3+", "Years in Business"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-1px", color: "#111" }}>{n}</div>
                  <div style={{ fontSize: ".75rem", color: "#999", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 16, padding: 32, boxShadow: "0 2px 40px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "4rem", textAlign: "center", marginBottom: 16 }}>🚗</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", textAlign: "center", marginBottom: 6 }}>Veltrix Mobile Detailing</div>
              <div style={{ textAlign: "center", fontSize: ".82rem", color: "#999", marginBottom: 24 }}>Union County, NJ</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { dot: "#22c55e", text: "Available this weekend" },
                  { dot: "#2563eb", text: "100% Satisfaction Guarantee" },
                  { dot: "#f59e0b", text: "Fully insured & certified" },
                ].map(b => (
                  <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8, padding: "10px 14px", fontSize: ".82rem", fontWeight: 500 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: b.dot, flexShrink: 0 }} />
                    {b.text}
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "block", textAlign: "center", background: "#2563eb", color: "#fff", padding: 14, borderRadius: 8, marginTop: 20, fontWeight: 600, fontSize: ".9rem", textDecoration: "none" }}>Book Your Detail →</a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: "#0a0a0a", padding: "32px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {[["500+", "Happy Clients"], ["3+ yrs", "In Business"], ["5.0 ★", "Google Rating"], ["10 mi", "Service Radius"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.9rem", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>{n}</div>
              <div style={{ fontSize: ".75rem", color: "#666", marginTop: 4, letterSpacing: ".04em", textTransform: "uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section style={{ background: "#fff", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>What We Do</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0a0a0a", marginBottom: 12 }}>Our Services</h2>
            <p style={{ fontSize: "1rem", color: "#777", lineHeight: 1.75, maxWidth: 480 }}>From a quick exterior shine to a full detail — we bring professional results to your driveway.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>
            {SERVICES.map((s, i) => (
              <div key={s.title} style={{ padding: "32px 28px", background: "#fff", borderRight: (i % 3 !== 2) ? "1px solid #ebebeb" : "none", borderBottom: i < 3 ? "1px solid #ebebeb" : "none" }}>
                <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#2563eb", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>{s.price} · {s.time}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#111", marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: ".85rem", color: "#777", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: "#fafafa", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Pricing</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0a0a0a" }}>Simple, Honest Prices</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: p.popular ? "#0a0a0a" : "#fff", border: `1px solid ${p.popular ? "#0a0a0a" : "#ebebeb"}`, borderRadius: 12, padding: "36px 28px", position: "relative" }}>
                {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: "#2563eb", color: "#fff", fontSize: ".65rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 50, whiteSpace: "nowrap" }}>Most Popular</div>}
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: p.popular ? "#6b9bf7" : "#2563eb", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>{p.name}</div>
                <div style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", color: p.popular ? "#fff" : "#0a0a0a", lineHeight: 1, marginBottom: 4 }}>
                  <sup style={{ fontSize: "1.2rem", verticalAlign: "super" }}>$</sup>{p.from.replace("$", "")}
                </div>
                <div style={{ fontSize: ".78rem", color: p.popular ? "#888" : "#aaa", marginBottom: 28 }}>starting price</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ fontSize: ".85rem", color: p.popular ? "#ccc" : "#555", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color: p.popular ? "#2563eb" : "#2563eb", flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#" style={{ display: "block", textAlign: "center", padding: 12, borderRadius: 6, fontSize: ".85rem", fontWeight: 600, textDecoration: "none", background: p.popular ? "#2563eb" : "transparent", color: p.popular ? "#fff" : "#111", border: p.popular ? "none" : "1px solid #ddd" }}>Book This</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section style={{ background: "#fff", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Real Results</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0a0a0a" }}>Before & After</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { label: "Full Exterior Wash", before: "#e8e0d4", after: "#dbeafe" },
              { label: "Interior Deep Clean", before: "#d4c5b0", after: "#dcfce7" },
              { label: "Pet Hair Removal", before: "#c8b9a5", after: "#fef9c3" },
            ].map(c => (
              <div key={c.label} style={{ border: "1px solid #ebebeb", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                  <div style={{ aspectRatio: "4/3", background: c.before, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#888", letterSpacing: ".08em", textTransform: "uppercase" }}>BEFORE</div>
                  <div style={{ aspectRatio: "4/3", background: c.after, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#2563eb", letterSpacing: ".08em", textTransform: "uppercase" }}>AFTER</div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ fontWeight: 600, fontSize: ".88rem", color: "#111" }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ background: "#fafafa", padding: "96px 5%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Reviews</div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0a0a0a" }}>What Clients Say</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: "#fff", border: "1px solid #ebebeb", borderRadius: 12, padding: 28 }}>
                <div style={{ color: "#f59e0b", fontSize: ".9rem", marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: ".88rem", color: "#444", lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ fontWeight: 600, fontSize: ".85rem", color: "#111" }}>{r.name}</div>
                <div style={{ fontSize: ".75rem", color: "#999", marginTop: 2 }}>{r.loc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <div style={{ background: "#0a0a0a", padding: "64px 5%", textAlign: "center" }}>
        <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 12 }}>Coverage Area</div>
        <h3 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#fff", marginBottom: 10, letterSpacing: "-0.5px" }}>Serving Union County & Surrounding Areas</h3>
        <p style={{ fontSize: ".88rem", color: "#666", maxWidth: 440, margin: "0 auto 28px" }}>We travel up to 10 miles from Union County to bring the detail to you.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 700, margin: "0 auto" }}>
          {CITIES.map(c => (
            <span key={c} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#999", borderRadius: 4, padding: "6px 14px", fontSize: ".78rem" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#050505", padding: "36px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>Velt<span style={{ color: "#2563eb" }}>rix</span></div>
        <div style={{ fontSize: ".78rem", color: "#555" }}>© {new Date().getFullYear()} Veltrix Mobile Detailing · Union County, NJ</div>
        <a href="tel:8623943198" style={{ fontSize: ".85rem", fontWeight: 600, color: "#fff", textDecoration: "none" }}>(862) 394-3198</a>
      </footer>
    </div>
  );
}
