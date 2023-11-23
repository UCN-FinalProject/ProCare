import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { healthcareProviderDoctors } from "./healthcareProvider";
import { relations } from "drizzle-orm";
import { healthInsurance } from "./healthInsurance";
import { healthCondition } from "./healthCondition";
import { doctor } from "./doctor";

export const patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name").notNull(),
  address: varchar("address").notNull(),
  personalDoctorID: integer("personal_doctor_id")
    .notNull()
    .references(() => healthcareProviderDoctors.id, { onDelete: "cascade" }),
  healthInsuranceID: integer("health_insurance_id")
    .notNull()
    .references(() => healthInsurance.id, { onDelete: "cascade" }),
});
export const patientRelations = relations(patient, ({ many, one }) => ({
  conditions: many(patientConditions),
  doctor: one(doctor, {
    fields: [patient.personalDoctorID],
    references: [doctor.id],
  }),
  healthInsurance: one(healthInsurance, {
    fields: [patient.healthInsuranceID],
    references: [healthInsurance.id],
  }),
}));
export type Patient = typeof patient.$inferInsert;

export const patientConditions = pgTable("patientConditions", {
  id: serial("id").primaryKey(),
  patientID: integer("patientID")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  conditionID: integer("conditionID")
    .notNull()
    .references(() => healthCondition.id, { onDelete: "cascade" }),
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
