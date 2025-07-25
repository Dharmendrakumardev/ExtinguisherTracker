import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fireExtinguishers = pgTable("fire_extinguishers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull().unique(),
  extinguisherNo: text("extinguisher_no").notNull(),
  location: text("location").notNull(),
  dateOfTesting: timestamp("date_of_testing").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const maintenanceLogs = pgTable("maintenance_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  extinguisherId: varchar("extinguisher_id").notNull().references(() => fireExtinguishers.id),
  dateWorkDone: timestamp("date_work_done").notNull(),
  remarks: text("remarks").notNull(),
  user: text("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const fireExtinguishersRelations = relations(fireExtinguishers, ({ many }) => ({
  maintenanceLogs: many(maintenanceLogs),
}));

export const maintenanceLogsRelations = relations(maintenanceLogs, ({ one }) => ({
  extinguisher: one(fireExtinguishers, {
    fields: [maintenanceLogs.extinguisherId],
    references: [fireExtinguishers.id],
  }),
}));

export const insertFireExtinguisherSchema = createInsertSchema(fireExtinguishers).omit({
  id: true,
  createdAt: true,
});

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogs).omit({
  id: true,
  createdAt: true,
});

export type FireExtinguisher = typeof fireExtinguishers.$inferSelect;
export type InsertFireExtinguisher = z.infer<typeof insertFireExtinguisherSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;

// Frontend-specific types for local storage
export type FireExtinguisherWithLogs = FireExtinguisher & {
  maintenanceLogs: MaintenanceLog[];
};
