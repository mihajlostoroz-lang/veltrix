import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useListAdminReviews } from "@workspace/api-client-react";
import StatsBar from "./StatsBar";
import DayView from "./DayView";
import BookingList from "./BookingList";
import GalleryManager from "./GalleryManager";
import ReviewsManager from "./ReviewsManager";

type View = "schedule" | "list" | "gallery" | "reviews";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("schedule");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const queryClient = useQueryClient();

  const refresh = () => queryClient.invalidateQueries();
  const { data: pendingData } = useListAdminReviews({ status: "pending" });
  const pendingCount = pendingData?.reviews?.length ?? 0;

  const tabBtn = (v: View, label: string, icon: string, badge?: number) => (
    <button
      onClick={() => setView(v)}
      style={{
        padding: "10px 22px", borderRadius: 50,
        fontSize: ".85rem", fontWeight: 600, cursor: "pointer",
        border: "none", fontFamily: "'DM Sans', sans-serif",
        background: view === v ? "#2563eb" : "transparent",
        color: view === v ? "#fff" : "#64748b",
        transition: "all .2s", display: "flex", alignItems: "center", gap: 6
      }}
    >
      {icon} {label}
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: view === v ? "rgba(255,255,255,0.35)" : "#ef4444",
          color: "#fff", borderRadius: 50, fontSize: ".68rem",
          fontWeight: 700, padding: "1px 7px", lineHeight: 1.5
        }}>{badge}</span>
      )}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f8ff", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div style={{
        background: "#0f172a", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, position: "sticky", top: 0, zIndex: 100
      }}>
        <a href="/" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.25rem", color: "#fff", textDecoration: "none" }}>
          Velt<span style={{ color: "#2563eb" }}>rix</span>
          <span style={{
            marginLeft: 10, fontSize: ".65rem", fontWeight: 700, color: "#2563eb",
            background: "rgba(37,99,235,0.2)", padding: "3px 10px", borderRadius: 50,
            letterSpacing: ".08em", textTransform: "uppercase", verticalAlign: "middle"
          }}>Admin</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={refresh} style={{
            background: "rgba(255,255,255,0.1)", border: "none", color: "#94a3b8",
            padding: "7px 16px", borderRadius: 50, fontSize: ".8rem", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>⟳ Refresh</button>
          <button onClick={onLogout} style={{
            background: "transparent", border: "1px solid #334155", color: "#94a3b8",
            padding: "7px 16px", borderRadius: 50, fontSize: ".8rem", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <StatsBar />

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 12
        }}>
          <div style={{
            background: "#fff", borderRadius: 50, padding: 4,
            border: "1px solid #e2e8f0", display: "inline-flex", gap: 2
          }}>
            {tabBtn("schedule", "Day View", "📅")}
            {tabBtn("list", "All Bookings", "📋")}
            {tabBtn("gallery", "Gallery", "🖼️")}
            {tabBtn("reviews", "Reviews", "⭐", pendingCount)}
          </div>
        </div>

        {view === "schedule" && <DayView selectedDate={selectedDate} onDateChange={setSelectedDate} />}
        {view === "list" && <BookingList />}
        {view === "gallery" && <GalleryManager />}
        {view === "reviews" && <ReviewsManager />}
      </div>
    </div>
  );
}
