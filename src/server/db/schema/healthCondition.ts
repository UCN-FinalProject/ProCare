import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { patientConditions } from "./patient";

export const healthCondition = pgTable("health_condition", {
  id: serial("ID").primaryKey(),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
});

export const healthConditionRelations = relations(
  healthCondition,
  ({ many }) => ({
    patients: many(patientConditions),
  }),
);

export type HealthCondition = typeof healthCondition.$inferSelect;
