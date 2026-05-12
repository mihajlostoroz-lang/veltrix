import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "rejected"]);

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location"),
  vehicle: text("vehicle"),
  rating: integer("rating").notNull(),
  text: text("text").notNull(),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Review = typeof reviewsTable.$inferSelect;
