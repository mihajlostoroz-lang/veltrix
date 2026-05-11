import { useState } from "react";
import { useListBookings, useUpdateBookingStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import BookingCard from "./BookingCard";

type StatusFilter = "" | "pending" | "confirmed" | "cancelled";

export default function BookingList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const qc = useQueryClient();

  const { data, isLoading } = useListBookings(
    statusFilter ? { status: statusFilter } : {}
  );

  const { mutate: updateStatus } = useUpdateBookingStatus({
    mutation: { onSuccess: () => qc.invalidateQueries() }
  });

  const handleStatus = (id: number, status: "confirmed" | "cancelled" | "pending") => {
    updateStatus({ id, data: { status } });
  };

  const filters: { value: StatusFilter; label: string; color: string }[] = [
    { value: "", label: "All", color: "#2563eb" },
    { value: "pending", label: "Pending", color: "#f59e0b" },
    { value: "confirmed", label: "Confirmed", color: "#16a34a" },
    { value: "cancelled", label: "Cancelled", color: "#ef4444" },
  ];

  // Group by date
  const grouped = new Map<string, NonNullable<typeof data>["bookings"]>();
  (data?.bookings ?? []).forEach((b) => {
    const arr = grouped.get(b.date) ?? [];
    arr.push(b);
    grouped.set(b.date, arr);
  });
  const sortedDates = [...grouped.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <div>
      {/* Filter bar */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 24,
        background: "#fff", borderRadius: 18, padding: "12px 16px",
        border: "1px solid #e2e8f0", flexWrap: "wrap", alignItems: "center"
      }}>
        <span style={{ fontSize: ".78rem", color: "#94a3b8", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase", marginRight: 4 }}>
          Filter:
        </span>
        {filters.map((f) => (
          <button key={f.value} onClick={() => setStatusFilter(f.value)} style={{
            padding: "7px 18px", borderRadius: 50, fontSize: ".82rem", fontWeight: 600,
            cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif",
            background: statusFilter === f.value ? f.color : "#f5f8ff",
            color: statusFilter === f.value ? "#fff" : "#64748b",
            transition: "all .2s"
          }}>{f.label}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: ".78rem", color: "#94a3b8" }}>
          {data?.total ?? 0} booking{(data?.total ?? 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⏳</div>
          Loading bookings...
        </div>
      ) : sortedDates.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0",
          background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0"
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</div>
          <p style={{ color: "#64748b", fontSize: ".95rem" }}>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sortedDates.map((date) => {
            const [y, m, d] = date.split("-").map(Number);
            const dateObj = new Date(y, m - 1, d);
            const label = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
            const dayBookings = (grouped.get(date) ?? []).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

            return (
              <div key={date}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 12
                }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".88rem",
                    color: "#0f172a"
                  }}>{label}</div>
                  <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                  <span style={{
                    fontSize: ".72rem", color: "#94a3b8", background: "#f5f8ff",
                    padding: "3px 10px", borderRadius: 50, border: "1px solid #e2e8f0"
                  }}>{dayBookings.length} appt{dayBookings.length !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {dayBookings.map((b) => (
                    <div key={b.id} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, alignItems: "center" }}>
                      <div style={{ textAlign: "right", fontSize: ".75rem", fontWeight: 600, color: "#94a3b8", paddingRight: 4 }}>
                        {b.timeSlot === "08:00" ? "8:00 AM"
                          : b.timeSlot === "09:00" ? "9:00 AM"
                          : b.timeSlot === "10:00" ? "10:00 AM"
                          : b.timeSlot === "11:00" ? "11:00 AM"
                          : b.timeSlot === "12:00" ? "12:00 PM"
                          : b.timeSlot === "13:00" ? "1:00 PM"
                          : b.timeSlot === "14:00" ? "2:00 PM"
                          : b.timeSlot === "15:00" ? "3:00 PM"
                          : b.timeSlot === "16:00" ? "4:00 PM"
                          : b.timeSlot === "17:00" ? "5:00 PM"
                          : b.timeSlot}
                      </div>
                      <BookingCard booking={b} onStatusChange={handleStatus} compact />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
