import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { healthcareProviderDoctors } from "./healthcareProvider";
import { relations } from "drizzle-orm";
import { healthInsurance } from "./healthInsurance";
import { healthCondition } from "./healthCondition";
import { procedure } from "./procedure";
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
  procedures: many(patientProcedure),
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
    patient: one(patient),
    conditions: one(healthCondition),
  }),
);

export const patientProcedure = pgTable("patientProcedures", {
  id: serial("id").primaryKey(),
  patientID: integer("patient_id")
    .references(() => patient.id, { onDelete: "cascade" })
    .notNull(),
  procedureID: integer("procedure_id")
    .references(() => procedure.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull().defaultNow(),
  doctorID: integer("doctor_id")
    .references(() => doctor.id, { onDelete: "cascade" })
    .notNull(),
});

export const patientProcedureRelations = relations(
  patientProcedure,
  ({ one }) => ({
    patient: one(patient),
    procedures: one(procedure),
  }),
);
