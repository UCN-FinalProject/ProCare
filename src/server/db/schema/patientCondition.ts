import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { patient, healthCondition } from "../export";
import { relations } from "drizzle-orm";

export const patientConditions = pgTable("patientConditions", {
  id: serial("id").primaryKey(),
  patientID: text("patientID")
    .notNull()
    .references(() => patient.id),
  conditionID: integer("conditionID")
    .notNull()
    .references(() => healthCondition.id),
});
export const patientConditionsRelations = relations(
  patientConditions,
  ({ one }) => ({
    patient: one(patient, {
      fields: [patientConditions.patientID],
      references: [patient.id],
    }),
    condition: one(healthCondition, {
      fields: [patientConditions.conditionID],
      references: [healthCondition.id],
    }),
  }),
);
