import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db";
import { eq, and, desc, count } from "drizzle-orm";

const router: IRouter = Router();

// GET /bookings — list all with optional ?date= and ?status= filters
router.get("/bookings", async (req, res) => {
  const { date, status } = req.query;

  const conditions = [];
  if (date && typeof date === "string") conditions.push(eq(bookingsTable.date, date));
  if (status && typeof status === "string") {
    const validStatuses = ["pending", "confirmed", "cancelled"] as const;
    if (validStatuses.includes(status as (typeof validStatuses)[number])) {
      conditions.push(eq(bookingsTable.status, status as (typeof validStatuses)[number]));
    }
  }

  const bookings = await db
    .select()
    .from(bookingsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(bookingsTable.date), bookingsTable.timeSlot);

  res.json({ bookings, total: bookings.length });
});

// PATCH /bookings/:id — update status
router.patch("/bookings/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid booking ID" });
    return;
  }

  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "cancelled"] as const;
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: "status must be one of: pending, confirmed, cancelled" });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status })
    .where(eq(bookingsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(updated);
});

// GET /admin/stats
router.get("/admin/stats", async (_req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const [total, pending, confirmed, cancelled, todayCount] = await Promise.all([
    db.select({ count: count() }).from(bookingsTable),
    db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending")),
    db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed")),
    db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "cancelled")),
    db.select({ count: count() }).from(bookingsTable).where(and(eq(bookingsTable.date, today), eq(bookingsTable.status, "pending"))),
  ]);

  res.json({
    total: total[0]?.count ?? 0,
    pending: pending[0]?.count ?? 0,
    confirmed: confirmed[0]?.count ?? 0,
    cancelled: cancelled[0]?.count ?? 0,
    today: todayCount[0]?.count ?? 0,
  });
});

export default router;
