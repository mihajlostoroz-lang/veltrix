import { useGetAdminStats } from "@workspace/api-client-react";

export default function StatsBar() {
  const { data } = useGetAdminStats();

  const cards = [
    { label: "Total Bookings", value: data?.total ?? "—", icon: "📊", color: "#2563eb" },
    { label: "Pending", value: data?.pending ?? "—", icon: "⏳", color: "#f59e0b" },
    { label: "Confirmed", value: data?.confirmed ?? "—", icon: "✅", color: "#16a34a" },
    { label: "Cancelled", value: data?.cancelled ?? "—", icon: "❌", color: "#ef4444" },
    { label: "Today", value: data?.today ?? "—", icon: "📅", color: "#8b5cf6" },
  ];

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 16, marginBottom: 32
    }}>
      {cards.map((c) => (
        <div key={c.label} style={{
          background: "#fff", borderRadius: 18, padding: "22px 20px",
          border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{c.icon}</div>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800,
            color: c.color, letterSpacing: "-1px", lineHeight: 1
          }}>{String(c.value)}</div>
          <div style={{ fontSize: ".75rem", color: "#94a3b8", marginTop: 4, fontWeight: 500, letterSpacing: ".03em", textTransform: "uppercase" }}>
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
}
