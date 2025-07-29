import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fireExtinguishers = sqliteTable("fire_extinguishers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  barcode: text("barcode").notNull().unique(),
  extinguisherNo: text("extinguisher_no").notNull(),
  location: text("location").notNull(),
  dateOfTesting: integer("date_of_testing", { mode: 'timestamp' }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const maintenanceLogs = sqliteTable("maintenance_logs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  extinguisherId: text("extinguisher_id").notNull().references(() => fireExtinguishers.id),
  dateWorkDone: integer("date_work_done", { mode: 'timestamp' }).notNull(),
  remarks: text("remarks").notNull(),
  user: text("user").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
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
