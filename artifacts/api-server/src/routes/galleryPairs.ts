import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryPairsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "./auth.js";

const router: IRouter = Router();

// GET /gallery/pairs — public read
router.get("/gallery/pairs", async (_req, res) => {
  const pairs = await db
    .select()
    .from(galleryPairsTable)
    .orderBy(desc(galleryPairsTable.createdAt));
  res.json({ pairs });
});

// POST /gallery/pairs — admin only
router.post("/gallery/pairs", requireAdmin, async (req, res) => {
  const { service, caption, beforePath, afterPath } = req.body;
  if (!beforePath && !afterPath) {
    res.status(400).json({ error: "At least one of beforePath or afterPath is required" });
    return;
  }
  const [pair] = await db.insert(galleryPairsTable).values({
    service: service || null,
    caption: caption || null,
    beforePath: beforePath || null,
    afterPath: afterPath || null,
  }).returning();
  res.status(201).json(pair);
});

// PATCH /gallery/pairs/:id — admin only
router.patch("/gallery/pairs/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

  const { service, caption, beforePath, afterPath } = req.body;
  const updates: Partial<{
    service: string | null;
    caption: string | null;
    beforePath: string | null;
    afterPath: string | null;
  }> = {};
  if (service !== undefined) updates.service = service || null;
  if (caption !== undefined) updates.caption = caption || null;
  if (beforePath !== undefined) updates.beforePath = beforePath || null;
  if (afterPath !== undefined) updates.afterPath = afterPath || null;

  const [pair] = await db
    .update(galleryPairsTable)
    .set(updates)
    .where(eq(galleryPairsTable.id, id))
    .returning();
  if (!pair) { res.status(404).json({ error: "Not found" }); return; }
  res.json(pair);
});

// DELETE /gallery/pairs/:id — admin only
router.delete("/gallery/pairs/:id", requireAdmin, async (req, res) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const [deleted] = await db
    .delete(galleryPairsTable)
    .where(eq(galleryPairsTable.id, id))
    .returning({ id: galleryPairsTable.id });
  if (!deleted) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ success: true });
});

export default router;
