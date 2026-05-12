import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const galleryPairsTable = pgTable("gallery_pairs", {
  id: serial("id").primaryKey(),
  service: text("service"),
  caption: text("caption"),
  beforePath: text("before_path"),
  afterPath: text("after_path"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryPair = typeof galleryPairsTable.$inferSelect;
