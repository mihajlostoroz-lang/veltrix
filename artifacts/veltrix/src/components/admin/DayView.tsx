import { useListBookings, useUpdateBookingStatus, useDeleteBooking } from "@workspace/api-client-react";
import type { BookingResponse } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import BookingCard from "./BookingCard";

const ALL_SLOTS = [
  { time: "08:00", label: "8:00 AM" },
  { time: "09:00", label: "9:00 AM" },
  { time: "10:00", label: "10:00 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "12:00", label: "12:00 PM" },
  { time: "13:00", label: "1:00 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
  { time: "17:00", label: "5:00 PM" },
];

function addDays(dateStr: string, n: number) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return date.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const todayStr = new Date().toISOString().split("T")[0];
  if (dateStr === todayStr) return "Today";
  if (dateStr === addDays(todayStr, 1)) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export default function DayView({ selectedDate, onDateChange }: {
  selectedDate: string;
  onDateChange: (d: string) => void;
}) {
  const qc = useQueryClient();
  const { data, isLoading } = useListBookings({ date: selectedDate });
  const { mutate: updateStatus } = useUpdateBookingStatus({ mutation: { onSuccess: () => qc.invalidateQueries() } });
  const { mutate: deleteBooking } = useDeleteBooking({ mutation: { onSuccess: () => qc.invalidateQueries() } });

  const bookingsBySlot = new Map<string, BookingResponse>();
  (data?.bookings ?? []).forEach(b => bookingsBySlot.set(b.timeSlot, b));

  const handleStatus = (id: number, status: "confirmed" | "cancelled" | "pending" | "completed") => {
    updateStatus({ id, data: { status } });
  };
  const handleDelete = (id: number) => deleteBooking({ id });

  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 16, marginBottom: 28,
        background: "#fff", borderRadius: 18, padding: "16px 24px",
        border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <button onClick={() => onDateChange(addDays(selectedDate, -1))} style={{
          background: "#f5f8ff", border: "1px solid #e2e8f0", borderRadius: 10,
          width: 36, height: 36, cursor: "pointer", fontSize: "1rem",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>‹</button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-.5px" }}>
            {formatDisplayDate(selectedDate)}
          </div>
          <div style={{ fontSize: ".78rem", color: "#94a3b8", marginTop: 2 }}>{selectedDate}</div>
        </div>
        <button onClick={() => onDateChange(addDays(selectedDate, 1))} style={{
          background: "#f5f8ff", border: "1px solid #e2e8f0", borderRadius: 10,
          width: 36, height: 36, cursor: "pointer", fontSize: "1rem",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>›</button>
        <button onClick={() => onDateChange(new Date().toISOString().split("T")[0])} style={{
          background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 50,
          padding: "6px 16px", cursor: "pointer", fontSize: ".78rem",
          fontWeight: 600, color: "#2563eb", fontFamily: "'DM Sans', sans-serif"
        }}>Today</button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#64748b" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⏳</div>Loading schedule...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_SLOTS.map(slot => {
            const booking = bookingsBySlot.get(slot.time);
            return (
              <div key={slot.time} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12, alignItems: "stretch", minHeight: 64 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 4, fontSize: ".78rem", fontWeight: 600, color: "#94a3b8" }}>
                  {slot.label}
                </div>
                {booking ? (
                  <BookingCard booking={booking} onStatusChange={handleStatus} onDelete={handleDelete} />
                ) : (
                  <div style={{ background: "#fff", borderRadius: 14, border: "1.5px dashed #e2e8f0", display: "flex", alignItems: "center", paddingLeft: 20, fontSize: ".8rem", color: "#cbd5e1" }}>
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && (
        <div style={{ marginTop: 24, textAlign: "center", fontSize: ".82rem", color: "#94a3b8" }}>
          {data?.total ?? 0} booking{(data?.total ?? 0) !== 1 ? "s" : ""} on {formatDisplayDate(selectedDate)}
        </div>
      )}
    </div>
  );
}
