import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { patient, procedures, users } from "../export";
import { relations } from "drizzle-orm";

export const patientProcedures = pgTable("patient_procedures", {
  id: serial("id").primaryKey(),
  patientID: text("patientID")
    .notNull()
    .references(() => patient.id),
  procedureID: integer("procedureID")
    .notNull()
    .references(() => procedures.id),
  note: text("note"),
  createdAt: timestamp("createdAt")
    .notNull()
    .$defaultFn(() => new Date()),
  createdBy: text("createdBy")
    .notNull()
    .references(() => users.id),
});
export const patientProceduresRelations = relations(
  patientProcedures,
  ({ one }) => ({
    patient: one(patient, {
      fields: [patientProcedures.patientID],
      references: [patient.id],
    }),
    procedures: one(procedures, {
      fields: [patientProcedures.procedureID],
      references: [procedures.id],
    }),
  }),
);
