import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { patient, procedures } from "../export";
import { relations } from "drizzle-orm";

export const patientProcedures = pgTable("patient_procedures", {
  id: serial("id").primaryKey(),
  patientID: text("patientID")
    .notNull()
    .references(() => patient.id),
  procedureID: integer("procedureID")
    .notNull()
    .references(() => procedures.id),
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
