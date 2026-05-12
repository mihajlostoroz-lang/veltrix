import type { Booking } from "@workspace/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

function formatSlot(timeSlot: string): string {
  const [h, m] = timeSlot.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export async function sendBookingNotification(booking: Booking): Promise<void> {
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) return;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #2563eb; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">🚗 New Booking — Veltrix Detailing</h1>
      </div>
      <div style="background: #f5f8ff; border: 1px solid #dbeafe; border-top: none; border-radius: 0 0 10px 10px; padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 140px;"><strong>Booking #</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">VTX-${String(booking.id).padStart(4, "0")}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Customer</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Phone</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.phone}</td></tr>
          ${booking.email ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Email</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.email}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Service</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.service}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Car Model</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.vehicle ?? "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>License Plate</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${booking.plate ?? "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Date</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${formatDate(booking.date)}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Time</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px;">${formatSlot(booking.timeSlot)}</td></tr>
          ${booking.notes ? `<tr><td style="padding: 8px 0; color: #64748b; font-size: 13px;"><strong>Notes</strong></td><td style="padding: 8px 0; color: #0f172a; font-size: 13px; font-style: italic;">"${booking.notes}"</td></tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #dbeafe; font-size: 12px; color: #94a3b8;">
          Sent automatically by Veltrix Detailing booking system.
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Veltrix Bookings <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL as string],
        subject: `New Booking: ${booking.name} — ${formatDate(booking.date)} at ${formatSlot(booking.timeSlot)}`,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend notification failed:", res.status, body);
    }
  } catch (err) {
    console.error("Failed to send booking notification:", err);
  }
}
