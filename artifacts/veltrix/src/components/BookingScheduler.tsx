import { useState } from "react";
import { useGetAvailability, useCreateBooking } from "@workspace/api-client-react";
import type { TimeSlot } from "@workspace/api-client-react";

const SERVICES = [
  { id: "exterior", label: "Exterior Wash", price: "$40+", icon: "🚿", duration: "1 hr" },
  { id: "interior", label: "Full Interior Detail", price: "$100+", icon: "🪣", duration: "4 hrs" },
  { id: "full", label: "Full Detail", price: "$160+", icon: "✨", duration: "5 hrs" },
  { id: "engine", label: "Engine Bay Cleaning", price: "+$50", icon: "⚙️", duration: "2 hrs" },
  { id: "pet", label: "Pet Hair Removal", price: "+$30", icon: "🐾", duration: "2 hrs" },
  { id: "paint", label: "Paint Correction", price: "Quote", icon: "🔮", duration: "6 hrs" },
  { id: "ceramic", label: "Ceramic Coating", price: "Quote", icon: "🛡️", duration: "8 hrs" },
];

const btn: React.CSSProperties = {
  background: "#1a1a2e", color: "#fff",
  padding: "12px 28px", borderRadius: 100,
  fontSize: ".88rem", fontWeight: 600, border: "none",
  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
};

const btnBlue: React.CSSProperties = {
  background: "#2563eb", color: "#fff",
  padding: "12px 28px", borderRadius: 100,
  fontSize: ".88rem", fontWeight: 600, border: "none",
  cursor: "pointer", fontFamily: "'Poppins', sans-serif",
};

const btnOutline: React.CSSProperties = {
  background: "transparent", color: "#1a1a2e",
  border: "1px solid rgba(26,26,46,0.2)",
  padding: "12px 28px", borderRadius: 100,
  fontSize: ".88rem", fontWeight: 500, cursor: "pointer",
  fontFamily: "'Poppins', sans-serif"
};

const inputStyle: React.CSSProperties = {
  border: "1px solid rgba(26,26,46,0.15)", borderRadius: 12,
  padding: "12px 16px", fontSize: ".9rem",
  fontFamily: "'Poppins', sans-serif",
  color: "#1a1a2e", background: "#fff", outline: "none",
  width: "100%", boxSizing: "border-box"
};

const labelStyle: React.CSSProperties = {
  fontSize: ".72rem", fontWeight: 700, color: "#999",
  letterSpacing: ".05em", textTransform: "uppercase",
  display: "block", marginBottom: 6
};

const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getAvailableDates() {
  const dates: { date: string; day: string; dow: string; isWeekend: boolean }[] = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    const dateStr = d.toISOString().split("T")[0];
    const day = d.getDate().toString();
    dates.push({ date: dateStr, day, dow: DOW_LABELS[dow], isWeekend: dow === 0 || dow === 6 });
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: i <= step ? "#1a1a2e" : "rgba(26,26,46,0.1)",
              color: i <= step ? "#fff" : "#bbb",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: ".75rem", fontWeight: 700,
              boxShadow: i === step ? "0 0 0 4px rgba(26,26,46,0.1)" : "none",
              transition: "all .3s"
            }}>
              {i < step ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: ".62rem", fontWeight: 700, letterSpacing: ".04em",
              textTransform: "uppercase",
              color: i === step ? "#1a1a2e" : "#bbb"
            }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 44, height: 1.5, marginBottom: 18, marginLeft: 2, marginRight: 2,
              background: i < step ? "#1a1a2e" : "rgba(26,26,46,0.12)",
              transition: "background .3s"
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
  const [form, setForm] = useState({ name: "", phone: "", email: "", vehicle: "", plate: "", notes: "" });
  const [booking, setBooking] = useState<{ id: number; date: string; timeSlot: string; service: string; name: string } | null>(null);
  const [submitError, setSubmitError] = useState("");

  const dates = getAvailableDates();

  const { data: availability, isLoading: slotsLoading } = useGetAvailability(
    { date: selectedDate || "1970-01-01", service: selectedService || undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: !!selectedDate } as any }
  );

  const { mutate: createBooking, isPending: submitting } = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        setBooking({ id: data.id, date: data.date, timeSlot: data.timeSlot, service: data.service, name: data.name });
        setSubmitError("");
        setStep(4);
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
        setSubmitError(msg || "Something went wrong. Please try again.");
      },
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    createBooking({
      data: {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        service: selectedService,
        vehicle: form.vehicle,
        plate: form.plate,
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
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.4rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
          Booking Confirmed!
        </h3>
        <p style={{ color: "#888", lineHeight: 1.7, marginBottom: 28, fontSize: ".92rem" }}>
          We'll reach out at <strong style={{ color: "#1a1a2e" }}>{form.phone}</strong> to confirm your appointment.
        </p>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "24px 28px",
          border: "1px solid rgba(26,26,46,0.08)", marginBottom: 28, textAlign: "left"
        }}>
          {[
            { label: "Booking #", val: `VTX-${String(booking.id).padStart(4, "0")}` },
            { label: "Service", val: selectedService },
            { label: "Date", val: formatDate(booking.date) },
            { label: "Time", val: slot?.label || booking.timeSlot },
            { label: "Name", val: booking.name },
            { label: "Vehicle", val: form.vehicle },
            ...(form.plate ? [{ label: "Plate", val: form.plate }] : []),
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid rgba(26,26,46,0.07)" }}>
              <span style={{ fontSize: ".8rem", color: "#999", fontWeight: 600, letterSpacing: ".03em" }}>{r.label}</span>
              <span style={{ fontSize: ".88rem", color: "#1a1a2e", fontWeight: 500 }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: ".8rem", color: "#999", fontWeight: 600, letterSpacing: ".03em" }}>Status</span>
            <span style={{
              fontSize: ".8rem", fontWeight: 700, color: "#16a34a",
              background: "#dcfce7", padding: "3px 12px", borderRadius: 100
            }}>Pending Confirmation</span>
          </div>
        </div>
        <a href="tel:8623943198" style={{ ...btnBlue, textDecoration: "none", display: "inline-block" }}>
          📞 Call Us: (862) 394-3198
        </a>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.25rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 28 }}>
        Book Your Detail
      </h3>

      <StepIndicator step={step} />

      {/* Step 0: Service */}
      {step === 0 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#888", marginBottom: 20 }}>What service are you looking for?</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SERVICES.map((s) => (
              <button key={s.id} onClick={() => { setSelectedService(s.label); setStep(1); }}
                style={{
                  background: selectedService === s.label ? "#1a1a2e" : "#fff",
                  border: `1px solid ${selectedService === s.label ? "#1a1a2e" : "rgba(26,26,46,0.1)"}`,
                  borderRadius: 14, padding: "16px 14px",
                  cursor: "pointer", textAlign: "left", transition: "all .2s",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: ".85rem", fontWeight: 700, color: selectedService === s.label ? "#fff" : "#1a1a2e", marginBottom: 2 }}>{s.label}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: ".75rem", color: selectedService === s.label ? "#93c5fd" : "#2563eb", fontWeight: 600 }}>{s.price}</span>
                  <span style={{ fontSize: ".7rem", color: selectedService === s.label ? "rgba(255,255,255,0.4)" : "#bbb" }}>· {s.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Date */}
      {step === 1 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#888", marginBottom: 8 }}>
            Pick a date for <strong style={{ color: "#1a1a2e" }}>{selectedService}</strong>.
          </p>
          <p style={{ fontSize: ".78rem", color: "#bbb", marginBottom: 16 }}>
            <strong style={{ color: "#2563eb" }}>Mon–Fri:</strong> 3 PM–5 PM &nbsp;·&nbsp; <strong style={{ color: "#2563eb" }}>Sat–Sun:</strong> 8 AM–6 PM
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {dates.map((d) => (
              <button key={d.date} onClick={() => { setSelectedDate(d.date); setSelectedSlot(""); }}
                style={{
                  background: selectedDate === d.date ? "#1a1a2e" : "#fff",
                  color: selectedDate === d.date ? "#fff" : "#1a1a2e",
                  border: `1px solid ${selectedDate === d.date ? "#1a1a2e" : d.isWeekend ? "rgba(37,99,235,0.25)" : "rgba(26,26,46,0.1)"}`,
                  borderRadius: 12, padding: "10px 14px",
                  cursor: "pointer", textAlign: "center", minWidth: 52, transition: "all .2s",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                <div style={{ fontSize: ".62rem", fontWeight: 700, opacity: .7, letterSpacing: ".05em",
                  color: selectedDate === d.date ? "#fff" : d.isWeekend ? "#2563eb" : undefined }}>{d.dow}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800 }}>{d.day}</div>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button style={btnOutline} onClick={() => setStep(0)}>← Back</button>
            <button style={{ ...btn, opacity: selectedDate ? 1 : 0.4, cursor: selectedDate ? "pointer" : "not-allowed" }}
              disabled={!selectedDate} onClick={() => setStep(2)}>
              Next: Pick Time →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Time slot */}
      {step === 2 && (
        <div>
          <p style={{ fontSize: ".88rem", color: "#888", marginBottom: 4 }}>
            Available slots for <strong style={{ color: "#1a1a2e" }}>{formatDate(selectedDate)}</strong>
          </p>
          <p style={{ fontSize: ".78rem", color: "#bbb", marginBottom: 16 }}>
            {(() => {
              const svc = SERVICES.find((s) => s.label === selectedService);
              return svc
                ? `${selectedService} takes ${svc.duration}. Booked times are shown as unavailable.`
                : "Booked times are shown as unavailable.";
            })()}
          </p>
          {slotsLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#999" }}>
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
                    background: !slot.available ? "rgba(26,26,46,0.04)" : selectedSlot === slot.time ? "#1a1a2e" : "#fff",
                    color: !slot.available ? "#ccc" : selectedSlot === slot.time ? "#fff" : "#1a1a2e",
                    border: `1px solid ${selectedSlot === slot.time ? "#1a1a2e" : "rgba(26,26,46,0.1)"}`,
                    borderRadius: 12, padding: "14px 10px",
                    cursor: slot.available ? "pointer" : "not-allowed",
                    fontFamily: "'Poppins', sans-serif", fontSize: ".9rem", fontWeight: 700,
                    textDecoration: !slot.available ? "line-through" : "none",
                    transition: "all .2s",
                    opacity: slot.available ? 1 : 0.5,
                  }}>
                  {slot.label}
                  {!slot.available && <span style={{ display: "block", fontSize: ".62rem", fontWeight: 400, textDecoration: "none", marginTop: 2 }}>Unavailable</span>}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button style={btnOutline} onClick={() => setStep(1)}>← Back</button>
            <button style={{ ...btn, opacity: selectedSlot ? 1 : 0.4, cursor: selectedSlot ? "pointer" : "not-allowed" }}
              disabled={!selectedSlot} onClick={() => setStep(3)}>
              Next: Your Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <p style={{ fontSize: ".88rem", color: "#888", marginBottom: 20 }}>
            Almost done! Just a few details and we're all set.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
            <label style={labelStyle}>Email <span style={{ fontWeight: 400, color: "#ccc", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <input type="email" style={inputStyle} placeholder="you@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Car Model *</label>
              <input required style={inputStyle} placeholder="e.g. 2020 Honda Accord" value={form.vehicle}
                onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>License Plate <span style={{ fontWeight: 400, color: "#ccc", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
              <input style={inputStyle} placeholder="e.g. ABC-1234" value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value.toUpperCase() })} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Booking Details <span style={{ fontWeight: 400, color: "#ccc", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              placeholder="Any special requests, conditions, or details we should know?" value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          {/* Summary */}
          <div style={{
            background: "#fff", borderRadius: 12, padding: "14px 18px",
            border: "1px solid rgba(26,26,46,0.08)", marginBottom: 20, fontSize: ".85rem"
          }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, color: "#555" }}>
              <span>🔧 <strong style={{ color: "#1a1a2e" }}>{selectedService}</strong></span>
              <span>📅 <strong style={{ color: "#1a1a2e" }}>{formatDate(selectedDate)}</strong></span>
              <span>🕐 <strong style={{ color: "#1a1a2e" }}>{availability?.slots?.find((s: TimeSlot) => s.time === selectedSlot)?.label}</strong></span>
            </div>
          </div>

          {submitError && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
              padding: "12px 16px", marginBottom: 16, color: "#dc2626", fontSize: ".85rem"
            }}>
              ⚠️ {submitError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button type="button" style={btnOutline} onClick={() => setStep(2)}>← Back</button>
            <button type="submit" disabled={submitting} style={{
              ...btnBlue, opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer"
            }}>
              {submitting ? "Booking..." : "Confirm Booking ✓"}
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: ".72rem", color: "#bbb", marginTop: 12 }}>
            We'll call to confirm within a few hours.
          </p>
        </form>
      )}
    </div>
  );
}
