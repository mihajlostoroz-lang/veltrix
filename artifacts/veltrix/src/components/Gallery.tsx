import { useEffect, useRef } from "react";
import exteriorHero from "@assets/IMG_1794_1778547880956.jpeg";
import exteriorBefore from "@assets/IMG_1795_1778547880956.jpeg";
import exteriorAfter from "@assets/IMG_1793_1778547880956.jpeg";

type Card = {
  title: string;
  desc: string;
  beforeEmoji?: string;
  afterEmoji?: string;
  heroImg?: string;
  beforeImg?: string;
  afterImg?: string;
};

const cards: Card[] = [
  {
    title: "Full Exterior Wash",
    desc: "Hand wash, clay bar, wax, tire shine & trim dressing",
    heroImg: exteriorHero,
    beforeImg: exteriorBefore,
    afterImg: exteriorAfter,
  },
  {
    beforeEmoji: "🟤", afterEmoji: "✨",
    title: "Interior Deep Clean",
    desc: "Shampooed seats, steam-cleaned carpet, full dashboard detail"
  },
  {
    beforeEmoji: "🐾", afterEmoji: "🌟",
    title: "Pet Hair Removal",
    desc: "Complete removal from all fabric surfaces including carpet and rear seats"
  },
];

export default function Gallery() {
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
    <section id="gallery" ref={ref} style={{ background: "#f5f8ff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          display: "inline-block", fontSize: ".75rem", fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2563eb", background: "#dbeafe",
          padding: "6px 16px", borderRadius: 50, marginBottom: 14
        }}>Real Results</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          fontWeight: 800, letterSpacing: "-1.2px",
          color: "#0f172a", marginBottom: 14
        }}>Before &amp; After</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          See the Veltrix difference — every job is done with the same care and attention to detail.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 24, maxWidth: 1100, margin: "0 auto"
      }}>
        {cards.map((c) => (
          <div key={c.title} className="reveal ba-card-hover" style={{
            background: "#ffffff", borderRadius: 20,
            overflow: "hidden", border: "1px solid #e2e8f0",
            transition: "transform .3s, box-shadow .3s"
          }}>
            {/* Hero photo (real image cards only) */}
            {c.heroImg && (
              <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden" }}>
                <img
                  src={c.heroImg}
                  alt="Exterior wash in progress"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)"
                }} />
                <span style={{
                  position: "absolute", bottom: 12, left: 16,
                  fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                  padding: "4px 12px", borderRadius: 50,
                  background: "#2563eb", color: "#fff"
                }}>In Action</span>
              </div>
            )}

            {/* Before / After panels */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {c.beforeImg ? (
                <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                  <img
                    src={c.beforeImg}
                    alt="Before exterior wash"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span style={{
                    position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                    fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                    padding: "3px 12px", borderRadius: 50,
                    background: "#e2e8f0", color: "#64748b"
                  }}>Before</span>
                </div>
              ) : (
                <div style={{
                  aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3.5rem", position: "relative",
                  background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)"
                }}>
                  {c.beforeEmoji}
                  <span style={{
                    position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                    fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                    padding: "3px 12px", borderRadius: 50,
                    background: "#e2e8f0", color: "#64748b"
                  }}>Before</span>
                </div>
              )}

              {c.afterImg ? (
                <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden" }}>
                  <img
                    src={c.afterImg}
                    alt="After exterior wash"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span style={{
                    position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                    fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                    padding: "3px 12px", borderRadius: 50,
                    background: "#2563eb", color: "#fff"
                  }}>After</span>
                </div>
              ) : (
                <div style={{
                  aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3.5rem", position: "relative",
                  background: "linear-gradient(135deg, #dbeafe, #eff6ff)"
                }}>
                  {c.afterEmoji}
                  <span style={{
                    position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
                    fontSize: ".68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em",
                    padding: "3px 12px", borderRadius: 50,
                    background: "#2563eb", color: "#fff"
                  }}>After</span>
                </div>
              )}
            </div>

            <div style={{ padding: "20px 22px" }}>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: ".95rem", fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>{c.title}</h4>
              <p style={{ fontSize: ".82rem", color: "#64748b", fontWeight: 300 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", marginTop: 32, fontSize: ".85rem", color: "#64748b" }}>
        📸 Check out more results on our{" "}
        <a href="https://www.instagram.com/veltrix.mobile.detail" target="_blank" rel="noreferrer"
          style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
          Instagram @veltrix.mobile.detail
        </a>
      </p>

      <style>{`
        .ba-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 40px rgba(37,99,235,0.12);
        }
      `}</style>
    </section>
  );
}
