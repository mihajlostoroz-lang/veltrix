import { useState } from "react";
import type { BookingResponse } from "@workspace/api-client-react";
import ReschedulePanel from "./ReschedulePanel";

const STATUS_CONFIG = {
  pending:   { bg: "#fefce8", border: "#fde047", color: "#854d0e", dot: "#eab308", label: "Pending" },
  confirmed: { bg: "#f0fdf4", border: "#86efac", color: "#14532d", dot: "#16a34a", label: "Confirmed" },
  cancelled: { bg: "#fef2f2", border: "#fca5a5", color: "#7f1d1d", dot: "#ef4444", label: "Cancelled" },
  completed: { bg: "#f0f9ff", border: "#7dd3fc", color: "#0c4a6e", dot: "#0284c7", label: "Completed" },
};

export default function BookingCard({
  booking,
  onStatusChange,
  onDelete,
  compact = false,
}: {
  booking: BookingResponse;
  onStatusChange: (id: number, status: "confirmed" | "cancelled" | "pending" | "completed") => void;
  onDelete?: (id: number) => void;
  compact?: boolean;
}) {
  const [rescheduling, setRescheduling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

  const formatTime = (slot: string) => {
    const [h] = slot.split(":").map(Number);
    return h < 12 ? `${h === 0 ? 12 : h}:00 AM` : `${h === 12 ? 12 : h - 12}:00 PM`;
  };

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric"
    });
  };

  return (
    <div style={{
      background: cfg.bg, borderRadius: 14,
      border: `1.5px solid ${cfg.border}`,
      padding: compact ? "12px 16px" : "18px 20px",
      transition: "transform .15s"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
        {/* Left: status dot + all booking info */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.dot, flexShrink: 0, marginTop: 4 }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            {/* Name + vehicle */}
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".95rem",
              color: "#0f172a", marginBottom: 4
            }}>
              {booking.name}
              {booking.vehicle && (
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#64748b", fontSize: ".82rem", marginLeft: 8 }}>
                  · {booking.vehicle}
                </span>
              )}
            </div>

            {/* All details */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: ".78rem", color: "#475569" }}>
              <span>🔧 {booking.service}</span>
              <span>📞 <a href={`tel:${booking.phone}`} style={{ color: "#2563eb", textDecoration: "none" }}>{booking.phone}</a></span>
              {booking.plate && <span>🚘 {booking.plate}</span>}
              {booking.email && <span>✉️ {booking.email}</span>}
              {!compact && <span>📅 {formatDate(booking.date)} at {formatTime(booking.timeSlot)}</span>}
            </div>

            {booking.notes && (
              <div style={{ fontSize: ".75rem", color: "#94a3b8", marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>
                Note: "{booking.notes}"
              </div>
            )}
          </div>
        </div>

        {/* Right: status badge + action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
          <span style={{
            fontSize: ".68rem", fontWeight: 700, color: cfg.color,
            letterSpacing: ".06em", textTransform: "uppercase",
            background: "rgba(255,255,255,0.6)", padding: "3px 10px",
            borderRadius: 50, border: `1px solid ${cfg.border}`
          }}>{cfg.label}</span>

          {booking.status !== "completed" && booking.status !== "cancelled" && (
            <button onClick={() => setRescheduling(v => !v)} style={{
              background: rescheduling ? "#eff6ff" : "transparent",
              color: "#2563eb", border: "1px solid #2563eb",
              borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>
              {rescheduling ? "✕ Close" : "📅 Reschedule"}
            </button>
          )}

          {booking.status === "pending" && (
            <button onClick={() => onStatusChange(booking.id, "confirmed")} style={{
              background: "#16a34a", color: "#fff", border: "none",
              borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>✓ Confirm</button>
          )}

          {(booking.status === "pending" || booking.status === "confirmed") && (
            <button onClick={() => onStatusChange(booking.id, "completed")} style={{
              background: "#0284c7", color: "#fff", border: "none",
              borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>✓ Done</button>
          )}

          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <button onClick={() => onStatusChange(booking.id, "cancelled")} style={{
              background: "transparent", color: "#ef4444",
              border: "1px solid #ef4444",
              borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>✕ Cancel</button>
          )}

          {(booking.status === "cancelled" || booking.status === "completed") && (
            <button onClick={() => onStatusChange(booking.id, "pending")} style={{
              background: "transparent", color: "#64748b",
              border: "1px solid #94a3b8",
              borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
              fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>↩ Restore</button>
          )}

          {onDelete && (
            confirmDelete ? (
              <>
                <button onClick={() => onDelete(booking.id)} style={{
                  background: "#ef4444", color: "#fff", border: "none",
                  borderRadius: 50, padding: "5px 12px", fontSize: ".72rem",
                  fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>Delete?</button>
                <button onClick={() => setConfirmDelete(false)} style={{
                  background: "transparent", color: "#94a3b8", border: "1px solid #e2e8f0",
                  borderRadius: 50, padding: "5px 10px", fontSize: ".72rem",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>No</button>
              </>
            ) : (
              <button onClick={() => setConfirmDelete(true)} title="Delete booking" style={{
                background: "transparent", color: "#ef4444",
                border: "none", borderRadius: 50,
                padding: "5px 8px", fontSize: ".8rem",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", lineHeight: 1
              }}>🗑</button>
            )
          )}
        </div>
      </div>

      {rescheduling && (
        <ReschedulePanel
          booking={booking}
          onSuccess={() => setRescheduling(false)}
          onCancel={() => setRescheduling(false)}
        />
      )}
    </div>
  );
}
