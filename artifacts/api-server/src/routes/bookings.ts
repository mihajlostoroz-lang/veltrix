import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq, and, ne } from "drizzle-orm";
import { sendBookingNotification, sendCustomerConfirmation } from "../lib/notify.js";

const router: IRouter = Router();

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

// Each appointment lasts 5 hours; a booking at slot index T blocks T and the
// next 5 slots (T+1..T+5). A candidate slot S conflicts with existing booking T
// when |index(S) - index(T)| <= 5.
const APPOINTMENT_SPAN = 5;

function getSlotIndex(time: string): number {
  return ALL_SLOTS.findIndex((s) => s.time === time);
}

function isWeekend(dateStr: string): boolean {
  // Parse as local date to avoid timezone shifts
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  return dow === 0 || dow === 6; // Sunday or Saturday
}

router.get("/availability", async (req, res) => {
  const { date } = req.query;

  if (!date || typeof date !== "string") {
    res.status(400).json({ error: "date query parameter is required (YYYY-MM-DD)" });
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    return;
  }

  if (!isWeekend(date)) {
    res.status(400).json({ error: "Bookings are only available on Saturdays and Sundays" });
    return;
  }

  // Fetch all non-cancelled bookings for this date
  const existing = await db
    .select({ timeSlot: bookingsTable.timeSlot })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), ne(bookingsTable.status, "cancelled")));

  const bookedIndices = existing
    .map((b) => getSlotIndex(b.timeSlot))
    .filter((i) => i >= 0);

  const slots = ALL_SLOTS.map((slot, i) => ({
    time: slot.time,
    label: slot.label,
    available: !bookedIndices.some((bi) => Math.abs(i - bi) <= APPOINTMENT_SPAN),
  }));

  res.json({ date, slots });
});

router.post("/bookings", async (req, res) => {
  const { name, phone, email, service, vehicle, plate, date, timeSlot, notes } = req.body;

  if (!name || !phone || !service || !date || !timeSlot || !vehicle || !plate) {
    res.status(400).json({ error: "name, phone, service, vehicle, plate, date, and timeSlot are required" });
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    return;
  }

  if (!isWeekend(date)) {
    res.status(400).json({ error: "Bookings are only available on Saturdays and Sundays" });
    return;
  }

  const newSlotIndex = getSlotIndex(timeSlot);
  if (newSlotIndex === -1) {
    res.status(400).json({ error: "Invalid time slot" });
    return;
  }

  // Check for conflicts: any non-cancelled booking within 5 slots of the requested slot
  const existing = await db
    .select({ timeSlot: bookingsTable.timeSlot })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), ne(bookingsTable.status, "cancelled")));

  const conflict = existing.some((b) => {
    const bi = getSlotIndex(b.timeSlot);
    return bi >= 0 && Math.abs(newSlotIndex - bi) <= APPOINTMENT_SPAN;
  });

  if (conflict) {
    res.status(409).json({ error: "This time slot conflicts with an existing booking. Please choose another." });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      name,
      phone,
      email: email || null,
      service,
      vehicle: vehicle || null,
      plate: plate || null,
      date,
      timeSlot,
      notes: notes || null,
    })
    .returning();

  // Fire-and-forget — never blocks the response
  void sendBookingNotification(booking);
  void sendCustomerConfirmation(booking);

  res.status(201).json(booking);
});

export default router;
