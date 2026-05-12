import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryPhotosTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/gallery/photos", async (req, res) => {
  const { service } = req.query;
  const rows = service && typeof service === "string"
    ? await db.select().from(galleryPhotosTable).where(eq(galleryPhotosTable.service, service)).orderBy(asc(galleryPhotosTable.sortOrder), asc(galleryPhotosTable.createdAt))
    : await db.select().from(galleryPhotosTable).orderBy(asc(galleryPhotosTable.sortOrder), asc(galleryPhotosTable.createdAt));
  res.json({ photos: rows });
});

router.post("/gallery/photos", async (req, res) => {
  const { service, photoType, objectPath, caption, sortOrder } = req.body;
  if (!service || !photoType || !objectPath) {
    res.status(400).json({ error: "service, photoType, and objectPath are required" });
    return;
  }
  const validTypes = ["hero", "before", "after"];
  if (!validTypes.includes(photoType)) {
    res.status(400).json({ error: "photoType must be hero, before, or after" });
    return;
  }
  const [photo] = await db.insert(galleryPhotosTable).values({
    service,
    photoType,
    objectPath,
    caption: caption || null,
    sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
  }).returning();
  res.status(201).json(photo);
});

router.delete("/gallery/photos/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid photo ID" });
    return;
  }
  const [photo] = await db.delete(galleryPhotosTable).where(eq(galleryPhotosTable.id, id)).returning();
  if (!photo) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }
  res.json(photo);
});

export default router;
