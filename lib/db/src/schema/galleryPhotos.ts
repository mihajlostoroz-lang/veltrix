import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const galleryPhotosTable = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  service: text("service").notNull(),
  photoType: text("photo_type").notNull(), // "hero" | "before" | "after"
  objectPath: text("object_path").notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryPhoto = typeof galleryPhotosTable.$inferSelect;
