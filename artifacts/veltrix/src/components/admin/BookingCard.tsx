import type { BookingResponse } from "@workspace/api-client-react";

const STATUS_CONFIG = {
  pending:   { bg: "#fefce8", border: "#fde047", color: "#854d0e", dot: "#eab308", label: "Pending" },
  confirmed: { bg: "#f0fdf4", border: "#86efac", color: "#14532d", dot: "#16a34a", label: "Confirmed" },
  cancelled: { bg: "#fef2f2", border: "#fca5a5", color: "#7f1d1d", dot: "#ef4444", label: "Cancelled" },
};

export default function BookingCard({
  booking,
  onStatusChange,
  compact = false,
}: {
  booking: BookingResponse;
  onStatusChange: (id: number, status: "confirmed" | "cancelled" | "pending") => void;
  compact?: boolean;
}) {
  const cfg = STATUS_CONFIG[booking.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

  return (
    <div style={{
      background: cfg.bg, borderRadius: 14,
      border: `1.5px solid ${cfg.border}`,
      padding: compact ? "12px 16px" : "16px 20px",
      display: "flex", alignItems: "center", gap: 16,
      flexWrap: "wrap", transition: "transform .15s"
    }}>
      {/* Status dot + booking info */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".92rem",
            color: "#0f172a", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
          }}>
            {booking.name}
            {booking.vehicle && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "#64748b", fontSize: ".82rem", marginLeft: 8 }}>
                · {booking.vehicle}
              </span>
            )}
          </div>
          <div style={{ fontSize: ".78rem", color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span>🔧 {booking.service}</span>
            <span>📞 <a href={`tel:${booking.phone}`} style={{ color: "#2563eb", textDecoration: "none" }}>{booking.phone}</a></span>
            {booking.plate && <span>🚘 {booking.plate}</span>}
            {booking.email && <span>✉️ {booking.email}</span>}
          </div>
          {booking.notes && (
            <div style={{ fontSize: ".75rem", color: "#94a3b8", marginTop: 4, fontStyle: "italic" }}>
              "{booking.notes}"
            </div>
          )}
        </div>
      </div>

      {/* Status badge + actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: ".7rem", fontWeight: 700, color: cfg.color,
          letterSpacing: ".05em", textTransform: "uppercase"
        }}>{cfg.label}</span>

        {booking.status !== "confirmed" && (
          <button onClick={() => onStatusChange(booking.id, "confirmed")} style={{
            background: "#16a34a", color: "#fff", border: "none",
            borderRadius: 50, padding: "5px 14px", fontSize: ".75rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>✓ Confirm</button>
        )}
        {booking.status !== "cancelled" && (
          <button onClick={() => onStatusChange(booking.id, "cancelled")} style={{
            background: "transparent", color: "#ef4444",
            border: "1px solid #ef4444",
            borderRadius: 50, padding: "5px 14px", fontSize: ".75rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>✕ Cancel</button>
        )}
        {booking.status === "cancelled" && (
          <button onClick={() => onStatusChange(booking.id, "pending")} style={{
            background: "transparent", color: "#64748b",
            border: "1px solid #94a3b8",
            borderRadius: 50, padding: "5px 14px", fontSize: ".75rem",
            fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
          }}>↩ Restore</button>
        )}
      </div>
    </div>
  );
}
