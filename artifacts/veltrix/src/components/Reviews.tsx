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
    <div style={{ color: "#f59e0b", fontSize: "1rem", marginBottom: 14, letterSpacing: 2 }}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </div>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLElement>(null);
  const [showForm, setShowForm] = useState(false);
  const { data } = useListReviews({});
  const dynamicReviews = data?.reviews ?? [];

  // If there are approved customer reviews, show those; otherwise show the static set
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
    <section id="reviews" ref={ref} style={{ background: "#ffffff", padding: "96px 5%" }}>
      <div className="reveal" style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{
          display: "inline-block", fontSize: ".75rem", fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "#2563eb", background: "#dbeafe",
          padding: "6px 16px", borderRadius: 50, marginBottom: 14
        }}>Customer Reviews</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
          fontWeight: 800, letterSpacing: "-1.2px",
          color: "#0f172a", marginBottom: 14
        }}>What Our Clients Say</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.72, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          We take pride in every detail. Here's what real customers in Union County say about Veltrix.
        </p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 22, maxWidth: 1100, margin: "0 auto"
      }}>
        {displayReviews.map((r, i) => (
          <div
            key={"id" in r ? r.id : r.name + i}
            className="reveal review-card-hover"
            style={{
              background: "#f5f8ff", borderRadius: 20,
              padding: 28, border: "1px solid #e2e8f0",
              transition: "transform .3s, box-shadow .3s"
            }}
          >
            <StarRow rating={r.rating} />
            <p style={{ fontSize: ".9rem", color: "#1e293b", lineHeight: 1.7, fontWeight: 300, marginBottom: 18, fontStyle: "italic" }}>
              {r.text.startsWith('"') ? r.text : `"${r.text}"`}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#dbeafe", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.1rem"
              }}>👤</div>
              <div>
                <div style={{ fontSize: ".88rem", fontWeight: 600, color: "#0f172a" }}>{r.name}</div>
                {"loc" in r
                  ? <div style={{ fontSize: ".76rem", color: "#64748b" }}>{r.loc}</div>
                  : r.location && <div style={{ fontSize: ".76rem", color: "#64748b" }}>{r.location}</div>
                }
                {"vehicle" in r && r.vehicle && (
                  <div style={{ fontSize: ".72rem", color: "#94a3b8" }}>{r.vehicle}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA strip */}
      <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 44, flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "#ffffff", border: "1px solid #e2e8f0",
          borderRadius: 50, padding: "12px 24px",
          fontSize: ".88rem", fontWeight: 500, color: "#0f172a",
          boxShadow: "0 2px 12px rgba(37,99,235,0.08)"
        }}>
          <span style={{ fontSize: "1.2rem" }}>🟦</span>
          <span>Rated <strong>5.0</strong> on Google</span>
          <span style={{ color: "#f59e0b", fontSize: ".88rem" }}>★★★★★</span>
        </div>

        <button
          onClick={() => setShowForm(true)}
          style={{
            background: "#2563eb", color: "#fff", border: "none",
            padding: "12px 28px", borderRadius: 50, fontSize: ".88rem",
            fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 18px rgba(37,99,235,0.25)", transition: "opacity .2s",
          }}
        >
          ⭐ Leave a Review
        </button>
      </div>

      {showForm && <ReviewForm onClose={() => setShowForm(false)} />}

      <style>{`
        .review-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 2px 12px rgba(37,99,235,0.08);
        }
      `}</style>
    </section>
  );
}
