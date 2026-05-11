import { pgTable, serial, text, date, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled"]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  service: text("service").notNull(),
  vehicle: text("vehicle"),
  plate: varchar("plate", { length: 20 }),
  date: date("date").notNull(),
  timeSlot: varchar("time_slot", { length: 10 }).notNull(),
  notes: text("notes"),
  status: bookingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const selectBookingSchema = createSelectSchema(bookingsTable);

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
