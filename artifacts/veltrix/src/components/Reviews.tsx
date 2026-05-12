import { useEffect, useRef, useState } from "react";
import { useListReviews } from "@workspace/api-client-react";
import ReviewForm from "./ReviewForm";

const STATIC_REVIEWS = [
  {
    text: '"Amazing service! They came right to my house and my car looks brand new. The interior was completely transformed — worth every penny."',
    name: "Michael T.", loc: "Elizabeth, NJ", rating: 5,
  },
  {
    text: '"I had a ton of pet hair from my golden retriever and they got every single strand out. Super professional and on time. Highly recommend!"',
    name: "Sarah K.", loc: "Summit, NJ", rating: 5,
  },
  {
    text: '"Best mobile detailing in Union County. Came to my office parking lot, did a full detail, and my car looked showroom fresh. Will be booking monthly."',
    name: "David R.", loc: "Westfield, NJ", rating: 5,
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ color: "#f59e0b", fontSize: ".95rem", marginBottom: 14, letterSpacing: 2 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </div>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [showForm, setShowForm] = useState(false);
  const { data } = useListReviews({});
  const dynamicReviews = data?.reviews ?? [];

  const displayReviews = dynamicReviews.length > 0 ? dynamicReviews : STATIC_REVIEWS;

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
    <section id="reviews" ref={ref} style={{ background: "#f5f4f0", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em",
          textTransform: "uppercase", color: "#2563eb", marginBottom: 12
        }}>Customer Reviews</div>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e", marginBottom: 14
        }}>What Our Clients Say</h2>
        <p style={{ fontSize: ".95rem", color: "#888", lineHeight: 1.72, maxWidth: 480, margin: "0 auto" }}>
          We take pride in every detail. Here's what real customers in Union County say about Veltrix.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 20, maxWidth: 1100, margin: "0 auto"
      }}>
        {displayReviews.map((r, i) => {
          const isDark = i % 3 === 1;
          return (
            <div
              key={"id" in r ? r.id : r.name + i}
              className="reveal review-card-hover"
              style={{
                background: isDark ? "#1a1a2e" : "#fff",
                borderRadius: 22,
                padding: "30px 28px",
                border: isDark ? "none" : "1px solid rgba(26,26,46,0.08)",
                boxShadow: isDark ? "none" : "0 2px 20px rgba(26,26,46,0.05)",
                transition: "transform .3s, box-shadow .3s"
              }}
            >
              <StarRow rating={r.rating} />
              <p style={{
                fontSize: ".9rem",
                color: isDark ? "rgba(255,255,255,0.7)" : "#555",
                lineHeight: 1.75, fontWeight: 400,
                marginBottom: 22, fontStyle: "italic"
              }}>
                {r.text.startsWith('"') ? r.text : `"${r.text}"`}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: isDark ? "rgba(255,255,255,0.1)" : "#f5f4f0",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
                }}>👤</div>
                <div>
                  <div style={{ fontSize: ".88rem", fontWeight: 700, color: isDark ? "#fff" : "#1a1a2e" }}>{r.name}</div>
                  {"loc" in r
                    ? <div style={{ fontSize: ".76rem", color: isDark ? "rgba(255,255,255,0.35)" : "#999" }}>{r.loc}</div>
                    : r.location && <div style={{ fontSize: ".76rem", color: isDark ? "rgba(255,255,255,0.35)" : "#999" }}>{r.location}</div>
                  }
                  {"vehicle" in r && r.vehicle && (
                    <div style={{ fontSize: ".72rem", color: isDark ? "rgba(255,255,255,0.25)" : "#bbb" }}>{r.vehicle}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 44, flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#fff", border: "1px solid rgba(26,26,46,0.08)",
          borderRadius: 100, padding: "12px 22px",
          fontSize: ".88rem", fontWeight: 500, color: "#1a1a2e"
        }}>
          <span style={{ color: "#f59e0b", fontSize: ".9rem" }}>★★★★★</span>
          Rated <strong style={{ marginLeft: 4 }}>5.0</strong>&nbsp;on Google
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#1a1a2e", color: "#fff", border: "none",
            padding: "12px 26px", borderRadius: 100, fontSize: ".88rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "'Poppins', sans-serif",
            transition: "opacity .2s",
          }}
        >
          Leave a Review
        </button>
      </div>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}

      <style>{`
        .review-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(26,26,46,0.1) !important;
        }
      `}</style>
    </section>
  );
}
