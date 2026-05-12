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

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!RESEND_API_KEY) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Veltrix Bookings <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend email failed:", res.status, body);
  }
}

// Notification to the owner
export async function sendBookingNotification(booking: Booking): Promise<void> {
  if (!NOTIFICATION_EMAIL) return;

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

  await sendEmail(
    NOTIFICATION_EMAIL,
    `New Booking: ${booking.name} — ${formatDate(booking.date)} at ${formatSlot(booking.timeSlot)}`,
    html,
  );
}

// Confirmation email to the customer
export async function sendCustomerConfirmation(booking: Booking): Promise<void> {
  if (!booking.email) return;

  const bookingNum = `VTX-${String(booking.id).padStart(4, "0")}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #2563eb; padding: 24px; border-radius: 10px 10px 0 0; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
        <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 800;">You're booked!</h1>
        <p style="color: #bfdbfe; margin: 8px 0 0; font-size: 14px;">Veltrix Mobile Detailing · Union County, NJ</p>
      </div>
      <div style="background: #f5f8ff; border: 1px solid #dbeafe; border-top: none; border-radius: 0 0 10px 10px; padding: 28px;">
        <p style="color: #0f172a; font-size: 15px; margin: 0 0 20px;">
          Hi <strong>${booking.name}</strong>, your appointment is confirmed. Here's a summary:
        </p>

        <div style="background: #fff; border: 1px solid #dbeafe; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px; width: 130px;"><strong>Booking #</strong></td>
              <td style="padding: 10px 0; color: #2563eb; font-size: 13px; font-weight: 700;">${bookingNum}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;"><strong>Service</strong></td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${booking.service}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;"><strong>Date</strong></td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${formatDate(booking.date)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;"><strong>Time</strong></td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${formatSlot(booking.timeSlot)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;"><strong>Vehicle</strong></td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${booking.vehicle ?? "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 13px;"><strong>Plate</strong></td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">${booking.plate ?? "—"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #92400e;">
          ⏳ <strong>Status: Pending Confirmation</strong> — We'll call you at <strong>${booking.phone}</strong> to confirm your appointment within a few hours.
        </div>

        <div style="text-align: center; margin-bottom: 24px;">
          <a href="tel:8623943198" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 14px; font-weight: 600;">
            📞 Call Us: (862) 394-3198
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          Questions? Reply to this email or call us directly.<br/>
          Veltrix Mobile Detailing · Union County, NJ
        </p>
      </div>
    </div>
  `;

  await sendEmail(
    booking.email,
    `Your Veltrix Booking is Confirmed — ${formatDate(booking.date)} at ${formatSlot(booking.timeSlot)}`,
    html,
  );
}
