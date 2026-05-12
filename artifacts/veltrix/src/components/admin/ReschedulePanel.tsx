import { useState } from "react";
import { useGetAvailability, useRescheduleBooking } from "@workspace/api-client-react";
import type { BookingResponse, TimeSlot } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

function getWeekendDates() {
  const dates: { date: string; day: string; dow: string; month: string }[] = [];
  const today = new Date();
  for (let i = 0; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) continue;
    const dateStr = d.toISOString().split("T")[0];
    dates.push({
      date: dateStr,
      day: d.getDate().toString(),
      dow: dow === 0 ? "Sun" : "Sat",
      month: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return dates;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ReschedulePanel({
  booking,
  onSuccess,
  onCancel,
}: {
  booking: BookingResponse;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const queryClient = useQueryClient();
  const dates = getWeekendDates();
  const [selectedDate, setSelectedDate] = useState(booking.date);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [error, setError] = useState("");

  const { data: availability, isLoading } = useGetAvailability(
    { date: selectedDate, service: booking.service || undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: !!selectedDate } as any },
  );

  const { mutate: reschedule, isPending } = useRescheduleBooking({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries();
        onSuccess();
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setError(msg || "Failed to reschedule. Please try another slot.");
      },
    },
  });

  const handleConfirm = () => {
    if (!selectedSlot) return;
    setError("");
    reschedule({ id: booking.id, data: { date: selectedDate, timeSlot: selectedSlot } });
  };

  const inputBase: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif", fontSize: ".8rem",
    borderRadius: 8, border: "1.5px solid #e2e8f0",
    cursor: "pointer", textAlign: "center", transition: "all .15s",
  };

  return (
    <div style={{
      marginTop: 12, padding: "16px 18px",
      background: "#f0f7ff", borderRadius: 12,
      border: "1.5px solid #bfdbfe",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".82rem", color: "#1d4ed8", marginBottom: 12 }}>
        📅 Reschedule — currently {formatDate(booking.date)} at {booking.timeSlot}
      </div>

      {/* Date picker */}
      <div style={{ fontSize: ".72rem", fontWeight: 600, color: "#64748b", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 6 }}>
        New Date
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => { setSelectedDate(d.date); setSelectedSlot(""); setError(""); }}
            style={{
              ...inputBase,
              padding: "6px 10px", minWidth: 52,
              background: selectedDate === d.date ? "#2563eb" : "#fff",
              color: selectedDate === d.date ? "#fff" : "#0f172a",
              border: selectedDate === d.date ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
            }}>
            <div style={{ fontSize: ".6rem", opacity: .8 }}>{d.dow}</div>
            <div style={{ fontWeight: 800, fontSize: ".9rem" }}>{d.day}</div>
            <div style={{ fontSize: ".58rem", opacity: .7 }}>{d.month}</div>
          </button>
        ))}
      </div>

      {/* Slot picker */}
      <div style={{ fontSize: ".72rem", fontWeight: 600, color: "#64748b", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 6 }}>
        New Time Slot
      </div>
      {isLoading ? (
        <div style={{ fontSize: ".8rem", color: "#94a3b8", marginBottom: 14 }}>Checking availability…</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 14 }}>
          {(availability?.slots ?? []).map((slot: TimeSlot) => {
            const isSameSlot = selectedDate === booking.date && slot.time === booking.timeSlot;
            const available = slot.available || isSameSlot;
            return (
              <button
                key={slot.time}
                disabled={!available}
                onClick={() => { setSelectedSlot(slot.time); setError(""); }}
                style={{
                  ...inputBase,
                  padding: "7px 4px",
                  background: !available ? "#f1f5f9" : selectedSlot === slot.time ? "#2563eb" : "#fff",
                  color: !available ? "#cbd5e1" : selectedSlot === slot.time ? "#fff" : "#0f172a",
                  border: selectedSlot === slot.time ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  opacity: available ? 1 : 0.5,
                  cursor: available ? "pointer" : "not-allowed",
                  fontSize: ".72rem", fontWeight: 700,
                }}>
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div style={{ fontSize: ".78rem", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleConfirm}
          disabled={!selectedSlot || isPending}
          style={{
            background: selectedSlot && !isPending ? "#2563eb" : "#e2e8f0",
            color: selectedSlot && !isPending ? "#fff" : "#94a3b8",
            border: "none", borderRadius: 50,
            padding: "7px 18px", fontSize: ".78rem", fontWeight: 600,
            cursor: selectedSlot && !isPending ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif",
          }}>
          {isPending ? "Saving…" : "✓ Confirm Reschedule"}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "transparent", color: "#64748b",
            border: "1px solid #cbd5e1", borderRadius: 50,
            padding: "7px 16px", fontSize: ".78rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
