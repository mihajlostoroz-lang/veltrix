import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

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

  const existing = await db
    .select({ timeSlot: bookingsTable.timeSlot })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), eq(bookingsTable.status, "pending")));

  const bookedSlots = new Set(existing.map((b) => b.timeSlot));

  const slots = ALL_SLOTS.map((slot) => ({
    time: slot.time,
    label: slot.label,
    available: !bookedSlots.has(slot.time),
  }));

  res.json({ date, slots });
});

router.post("/bookings", async (req, res) => {
  const { name, phone, email, service, vehicle, date, timeSlot, notes } = req.body;

  if (!name || !phone || !service || !date || !timeSlot) {
    res.status(400).json({ error: "name, phone, service, date, and timeSlot are required" });
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    return;
  }

  const validSlot = ALL_SLOTS.find((s) => s.time === timeSlot);
  if (!validSlot) {
    res.status(400).json({ error: "Invalid time slot" });
    return;
  }

  const conflict = await db
    .select({ id: bookingsTable.id })
    .from(bookingsTable)
    .where(and(eq(bookingsTable.date, date), eq(bookingsTable.timeSlot, timeSlot), eq(bookingsTable.status, "pending")))
    .limit(1);

  if (conflict.length > 0) {
    res.status(409).json({ error: "This time slot is already booked. Please choose another." });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({ name, phone, email: email || null, service, vehicle: vehicle || null, date, timeSlot, notes: notes || null })
    .returning();

  res.status(201).json(booking);
});

export default router;
