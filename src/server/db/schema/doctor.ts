import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { healthcareProviderDoctors } from "./healthcareProvider";

export const doctor = pgTable("doctor", {
  id: serial("ID").primaryKey(),
  fullName: varchar("full_name").notNull(),
  doctorID: varchar("doctor_id").notNull(),
  note: varchar("note"),
  isActive: boolean("is_active").default(true),
});
export type Doctor = typeof doctor.$inferSelect;

export const doctorRelations = relations(doctor, ({ many }) => ({
  healthcareProviders: many(healthcareProviderDoctors),
}));
