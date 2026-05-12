import { useState } from "react";
import { useCreateReview } from "@workspace/api-client-react";

interface Props {
  onClose: () => void;
}

export default function ReviewForm({ onClose }: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { mutate, isPending } = useCreateReview({
    mutation: {
      onSuccess: () => setSubmitted(true),
      onError: () => setError("Something went wrong. Please try again."),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (rating === 0) { setError("Please select a star rating."); return; }
    if (!text.trim()) { setError("Please write a short review."); return; }
    mutate({ data: { name: name.trim(), location: location.trim() || undefined, vehicle: vehicle.trim() || undefined, rating, text: text.trim() } });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: ".9rem", color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
    outline: "none", transition: "border-color .2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: ".78rem", fontWeight: 700,
    color: "#475569", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.55)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: "36px 32px",
        width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
      }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌟</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#0f172a", marginBottom: 10 }}>
              Thank You!
            </h3>
            <p style={{ color: "#64748b", fontSize: ".95rem", lineHeight: 1.6, marginBottom: 28 }}>
              Your review has been submitted and will appear on our site after a quick check. We really appreciate your feedback!
            </p>
            <button onClick={onClose} style={{
              background: "#2563eb", color: "#fff", border: "none",
              padding: "13px 36px", borderRadius: 50, fontSize: ".9rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.2rem", color: "#0f172a", margin: 0 }}>
                Share Your Experience
              </h3>
              <button onClick={onClose} style={{
                background: "none", border: "none", fontSize: "1.2rem",
                cursor: "pointer", color: "#94a3b8", lineHeight: 1,
              }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>Your Name *</label>
                <input style={inputStyle} placeholder="e.g. Michael T." value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>City (optional)</label>
                  <input style={inputStyle} placeholder="e.g. Elizabeth, NJ" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Your Car (optional)</label>
                  <input style={inputStyle} placeholder="e.g. 2020 Honda Accord" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Rating *</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "2rem", padding: "0 2px", lineHeight: 1,
                        color: star <= (hoverRating || rating) ? "#f59e0b" : "#e2e8f0",
                        transition: "color .1s", transform: star <= (hoverRating || rating) ? "scale(1.1)" : "scale(1)",
                      }}
                    >★</button>
                  ))}
                  {rating > 0 && (
                    <span style={{ alignSelf: "center", fontSize: ".82rem", color: "#64748b", marginLeft: 6 }}>
                      {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Your Review *</label>
                <textarea
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
                  placeholder="Tell others about your experience with Veltrix..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {error && <p style={{ fontSize: ".85rem", color: "#ef4444", margin: 0 }}>{error}</p>}

              <button type="submit" disabled={isPending} style={{
                background: "#2563eb", color: "#fff", border: "none",
                padding: "14px 0", borderRadius: 50, fontSize: ".95rem",
                fontWeight: 700, cursor: isPending ? "not-allowed" : "pointer",
                fontFamily: "'DM Sans', sans-serif", opacity: isPending ? 0.7 : 1,
                transition: "opacity .2s",
              }}>
                {isPending ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
