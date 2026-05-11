import { useState } from "react";
import { useGetAvailability, useCreateBooking } from "@workspace/api-client-react";
import type { TimeSlot } from "@workspace/api-client-react";

const SERVICES = [
  { id: "exterior", label: "Exterior Wash", price: "$40+", icon: "🚿" },
  { id: "interior", label: "Full Interior Detail", price: "$100+", icon: "🪣" },
  { id: "full", label: "Full Detail", price: "$160+", icon: "✨" },
  { id: "engine", label: "Engine Bay Cleaning", price: "+$50", icon: "⚙️" },
  { id: "pet", label: "Pet Hair Removal", price: "+$30", icon: "🐾" },
  { id: "custom", label: "Custom Quote", price: "Call us", icon: "💎" },
];

const btn: React.CSSProperties = {
  background: "#2563eb", color: "#fff",
  padding: "13px 32px", borderRadius: 50,
  fontSize: ".9rem", fontWeight: 500, border: "none",
  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  boxShadow: "0 4px 16px rgba(37,99,235,0.28)"
};

const btnOutline: React.CSSProperties = {
  background: "transparent", color: "#2563eb",
  border: "1.5px solid #2563eb",
  padding: "13px 32px", borderRadius: 50,
  fontSize: ".9rem", fontWeight: 500, cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif"
};

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #e2e8f0", borderRadius: 12,
  padding: "12px 16px", fontSize: ".9rem",
  fontFamily: "'DM Sans', sans-serif",
  color: "#0f172a", background: "#ffffff", outline: "none",
  width: "100%", boxSizing: "border-box"
};

const labelStyle: React.CSSProperties = {
  fontSize: ".75rem", fontWeight: 600, color: "#64748b",
  letterSpacing: ".04em", textTransform: "uppercase", display: "block", marginBottom: 6
};

// Generate next 30 days starting from tomorrow
function getAvailableDates() {
  const dates: { date: string; day: string; dow: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 0) continue; // skip Sundays
    const dateStr = d.toISOString().split("T")[0];
    const day = d.getDate().toString();
    const dowLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dow];
    dates.push({ date: dateStr, day, dow: dowLabel });
  }
  return dates;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Service", "Date", "Time", "Details"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i < step ? "#2563eb" : i === step ? "#2563eb" : "#e2e8f0",
              color: i <= step ? "#fff" : "#94a3b8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: ".78rem", fontWeight: 700,
              boxShadow: i === step ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
              transition: "all .3s"
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: ".65rem", color: i === step ? "#2563eb" : "#94a3b8", fontWeight: 600, letterSpacing: ".04em", textTransform: "uppercase" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 48, height: 2, marginBottom: 18, marginLeft: 2, marginRight: 2,
              background: i < step ? "#2563eb" : "#e2e8f0", transition: "background .3s"
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingScheduler() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", vehicle: "", notes: "" });
  const [booking, setBooking] = useState<{ id: number; date: string; timeSlot: string; service: string; name: string } | null>(null);

  const dates = getAvailableDates();

  const { data: availability, isLoading: slotsLoading } = useGetAvailability(
    { date: selectedDate || "1970-01-01" },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: !!selectedDate } as any }
  );

  const { mutate: createBooking, isPending: submitting } = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setBooking({ id: data.id, date: data.date, timeSlot: data.timeSlot, service: data.service, name: data.name });
        setStep(4);
      },
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking({
      data: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service: selectedService,
        vehicle: form.vehicle || undefined,
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: form.notes || undefined,
      }
    });
  };

  // Step 4: Confirmation
  if (step === 4 && booking) {
    const slot = availability?.slots?.find((s: TimeSlot) => s.time === booking.timeSlot);
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
          Booking Confirmed!
        </h3>
        <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: 28, fontSize: ".95rem" }}>
          We'll reach out at <strong>{form.phone}</strong> to confirm your appointment.
        </p>
        <div style={{
          background: "#f5f8ff", borderRadius: 16, padding: "24px 28px",
          border: "1px solid #dbeafe", marginBottom: 28, textAlign: "left"
        }}>
          {[
            { label: "Booking #", val: `VTX-${String(booking.id).padStart(4, "0")}` },
            { label: "Service", val: selectedService },
            { label: "Date", val: formatDate(booking.date) },
            { label: "Time", val: slot?.label || booking.timeSlot },
            { label: "Name", val: booking.name },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: ".82rem", color: "#64748b", fontWeight: 600, letterSpacing: ".03em" }}>{r.label}</span>
              <span style={{ fontSize: ".88rem", color: "#0f172a", fontWeight: 500 }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: ".82rem", color: "#64748b", fontWeight: 600, letterSpacing: ".03em" }}>Status</span>
            <span style={{
              fontSize: ".82rem", fontWeight: 700, color: "#16a34a",
              background: "#dcfce7", padding: "3px 12px", borderRadius: 50
            }}>Pending Confirmation</span>
          </div>
        </div>
        <a href="tel:8623943198" style={{ ...btn, textDecoration: "none", display: "inline-block" }}>
          📞 Call Us: (862) 394-3198
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: 28 }}>
        Book Your Detail
      </h3>

      <StepIndicator step={step} />

      {/* Step 0: Service */}
      {step === 0 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#64748b", marginBottom: 20, fontWeight: 300 }}>What service are you looking for?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setSelectedService(s.label); setStep(1); }}
                style={{
                  background: selectedService === s.label ? "#eff6ff" : "#f5f8ff",
                  border: selectedService === s.label ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                  borderRadius: 14, padding: "16px 14px",
                  cursor: "pointer", textAlign: "left", transition: "all .2s"
                }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: ".85rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: ".75rem", color: "#2563eb", fontWeight: 600 }}>{s.price}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Date */}
      {step === 1 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#64748b", marginBottom: 20, fontWeight: 300 }}>
            Pick a date — <strong>{selectedService}</strong>. We're available Mon–Sat.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {dates.map((d) => (
              <button key={d.date} onClick={() => { setSelectedDate(d.date); setSelectedSlot(""); }}
                style={{
                  background: selectedDate === d.date ? "#2563eb" : "#f5f8ff",
                  color: selectedDate === d.date ? "#fff" : "#0f172a",
                  border: selectedDate === d.date ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                  borderRadius: 12, padding: "10px 14px",
                  cursor: "pointer", textAlign: "center", minWidth: 60, transition: "all .2s"
                }}>
                <div style={{ fontSize: ".65rem", fontWeight: 700, opacity: .8, letterSpacing: ".05em" }}>{d.dow}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 800 }}>{d.day}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button style={btnOutline} onClick={() => setStep(0)}>← Back</button>
            <button style={{ ...btn, opacity: selectedDate ? 1 : 0.5, cursor: selectedDate ? "pointer" : "not-allowed" }}
              disabled={!selectedDate} onClick={() => setStep(2)}>
              Next: Pick Time →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Time slot */}
      {step === 2 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#64748b", marginBottom: 8, fontWeight: 300 }}>
            Available slots for <strong>{formatDate(selectedDate)}</strong>
          </p>
          {slotsLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>⏳</div>
              Checking availability...
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {(availability?.slots ?? []).map((slot: TimeSlot) => (
                <button key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedSlot(slot.time)}
                  style={{
                    background: !slot.available ? "#f1f5f9" : selectedSlot === slot.time ? "#2563eb" : "#f5f8ff",
                    color: !slot.available ? "#cbd5e1" : selectedSlot === slot.time ? "#fff" : "#0f172a",
                    border: selectedSlot === slot.time ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                    borderRadius: 12, padding: "14px 10px",
                    cursor: slot.available ? "pointer" : "not-allowed",
                    fontFamily: "'Syne', sans-serif", fontSize: ".9rem", fontWeight: 700,
                    textDecoration: !slot.available ? "line-through" : "none",
                    transition: "all .2s"
                  }}>
                  {slot.label}
                  {!slot.available && <span style={{ display: "block", fontSize: ".65rem", fontWeight: 400, textDecoration: "none", marginTop: 2 }}>Booked</span>}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button style={btnOutline} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...btn, opacity: selectedSlot ? 1 : 0.5, cursor: selectedSlot ? "pointer" : "not-allowed" }}
              disabled={!selectedSlot} onClick={() => setStep(3)}>
              Next: Your Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: ".88rem", color: "#64748b", marginBottom: 20, fontWeight: 300 }}>
            Almost done! Just a few details and we're all set.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="form-row2">
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Name *</label>
              <input required style={inputStyle} placeholder="John Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Phone *</label>
              <input type="tel" required style={inputStyle} placeholder="(555) 000-0000" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Email</label>
            <input type="email" style={inputStyle} placeholder="you@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Vehicle</label>
            <input style={inputStyle} placeholder="e.g. 2020 Honda Accord Sedan" value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              placeholder="Any special requests or conditions we should know?" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          {/* Summary */}
          <div style={{
            background: "#f5f8ff", borderRadius: 12, padding: "14px 18px",
            border: "1px solid #dbeafe", marginBottom: 20, fontSize: ".85rem"
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <span>🔧 <strong>{selectedService}</strong></span>
              <span>📅 <strong>{formatDate(selectedDate)}</strong></span>
              <span>🕐 <strong>{availability?.slots?.find((s: TimeSlot) => s.time === selectedSlot)?.label}</strong></span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button type="button" style={btnOutline} onClick={() => setStep(2)}>← Back</button>
            <button type="submit" disabled={submitting} style={{
              ...btn, opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer"
            }}>
              {submitting ? "Booking..." : "Confirm Booking ✓"}
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: ".75rem", color: "#94a3b8", marginTop: 12 }}>
            We'll call to confirm within a few hours.
          </p>
        </form>
      )}
    </div>
  );
}
