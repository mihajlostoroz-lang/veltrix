import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq, and, ne } from "drizzle-orm";
import { sendBookingNotification, sendCustomerConfirmation } from "../lib/notify.js";
import { ALL_SLOTS, getSlotIndex, isWeekend, getServiceDuration, hasConflict, DEFAULT_DURATION } from "../lib/slots.js";

const router: IRouter = Router();

router.get("/availability", async (req, res) => {
  const { date, service } = req.query;

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

  // Duration of the incoming booking (used for forward-direction conflict check)
  const dNew = typeof service === "string" && service
    ? getServiceDuration(service)
    : DEFAULT_DURATION;

  const existing = await db
    .select({ timeSlot: bookingsTable.timeSlot, service: bookingsTable.service })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), ne(bookingsTable.status, "cancelled")));

  const slots = ALL_SLOTS.map((slot, i) => ({
    time: slot.time,
    label: slot.label,
    available: !hasConflict(existing, i, dNew),
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

  const dNew = getServiceDuration(service as string);

  const existing = await db
    .select({ timeSlot: bookingsTable.timeSlot, service: bookingsTable.service })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), ne(bookingsTable.status, "cancelled")));

  if (hasConflict(existing, newSlotIndex, dNew)) {
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

  void sendBookingNotification(booking);
  void sendCustomerConfirmation(booking);

  res.status(201).json(booking);
});

export default router;
