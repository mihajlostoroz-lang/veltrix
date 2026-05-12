import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "./auth.js";

const router: IRouter = Router();

// POST /reviews — public review submission
router.post("/reviews", async (req, res) => {
  const { name, location, vehicle, rating, text } = req.body;
  if (!name || !text || rating == null) {
    res.status(400).json({ error: "name, text, and rating are required" });
    return;
  }
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    res.status(400).json({ error: "rating must be an integer between 1 and 5" });
    return;
  }
  const [review] = await db.insert(reviewsTable).values({
    name,
    location: location || null,
    vehicle: vehicle || null,
    rating: r,
    text,
  }).returning();
  res.status(201).json(review);
});

// GET /reviews — list approved reviews (public)
router.get("/reviews", async (_req, res) => {
  const rows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.status, "approved"))
    .orderBy(desc(reviewsTable.createdAt));
  res.json({ reviews: rows });
});

// GET /admin/reviews — list all reviews for admin (protected)
router.get("/admin/reviews", requireAdmin, async (req, res) => {
  const { status } = req.query;
  const validStatuses = ["pending", "approved", "rejected"] as const;
  type Status = (typeof validStatuses)[number];

  let rows;
  if (status && typeof status === "string" && validStatuses.includes(status as Status)) {
    rows = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.status, status as Status))
      .orderBy(desc(reviewsTable.createdAt));
  } else {
    rows = await db
      .select()
      .from(reviewsTable)
      .orderBy(desc(reviewsTable.createdAt));
  }
  res.json({ reviews: rows, total: rows.length });
});

// PATCH /admin/reviews/:id — approve or reject (protected)
router.patch("/admin/reviews/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }
  const { status } = req.body;
  const validStatuses = ["pending", "approved", "rejected"];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: "status must be pending, approved, or rejected" });
    return;
  }
  const [review] = await db
    .update(reviewsTable)
    .set({ status })
    .where(eq(reviewsTable.id, id))
    .returning();
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(review);
});

export default router;
