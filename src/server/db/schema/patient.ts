import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import {
  externalHealthcareProvider,
  patientConditions,
  doctor,
  healthInsurance,
  patientProcedures,
  type PatientConditions,
} from "../export";

export const biologicalSex = pgEnum("biological_sex", ["male", "female"]);
export const biologicalSexValues = biologicalSex.enumValues;
export type BiologicalSex = (typeof biologicalSex.enumValues)[number];
export const disability = pgEnum("disability", [
  "limited_physical",
  "physical",
  "mental",
  "none",
]);
export const disabilities = disability.enumValues;
export type Disability = (typeof disability.enumValues)[number];

export const patient = pgTable("patient", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  fullName: varchar("full_name").notNull(),
  isActive: boolean("is_active")
    .notNull()
    .$default(() => true),
  biologicalSex: biologicalSex("biological_sex").notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  ssn: varchar("ssn").notNull().unique(),
  recommendationDate: timestamp("recommendation_date"),
  acceptanceDate: timestamp("acceptance_date"),
  startDate: timestamp("start_date").notNull(),
  expectedEndOfTreatment: timestamp("expected_end_of_treatment").notNull(),
  endDate: timestamp("end_date"),
  insuredID: varchar("insured_id").notNull().unique(),
  email: varchar("email"),
  phone: varchar("phone"),
  disability: disability("disability").notNull(),
  alergies: varchar("alergies"),
  note: varchar("note"),
});
export const patientRelations = relations(patient, ({ many, one }) => ({
  conditions: many(patientConditions),
  procedures: many(patientProcedures),
  healthcareInfo: one(patientHealthcareInfo, {
    fields: [patient.id],
    references: [patientHealthcareInfo.patientID],
  }),
  address: one(patientAddress, {
    fields: [patient.id],
    references: [patientAddress.patientID],
  }),
}));
export type Patient = typeof patient.$inferInsert & {
  conditions: PatientConditions[];
  address: typeof patientAddress.$inferInsert;
  healthcareInfo: typeof patientHealthcareInfo.$inferInsert;
};
export type PatientWithoutCondition = Omit<Patient, "conditions">;

// patient healthcare info
export const patientHealthcareInfo = pgTable(
  "patient_healthcare_info",
  {
    id: serial("id").primaryKey(),
    patientID: text("patient_id")
      .notNull()
      .references(() => patient.id, { onDelete: "cascade" }),
    healthInsuranceID: integer("health_insurance_id")
      .notNull()
      .references(() => healthInsurance.id, { onDelete: "cascade" }),
    doctorID: integer("doctor_id")
      .notNull()
      .references(() => doctor.id, { onDelete: "cascade" }),
    healthcareProviderID: integer("healthcare_provider_id")
      .notNull()
      .references(() => externalHealthcareProvider.id, { onDelete: "cascade" }),
  },
  (patientHealthcareInfo) => ({
    patientIDIdx: index("patient_healthcare_info_patient_id_idx").on(
      patientHealthcareInfo.patientID,
    ),
    healthInsuranceIDIdx: index(
      "patient_healthcare_info_health_insurance_id_idx",
    ).on(patientHealthcareInfo.healthInsuranceID),
    doctorIDIdx: index("patient_healthcare_info_doctor_id_idx").on(
      patientHealthcareInfo.doctorID,
    ),
    healthcareProviderIDIdx: index(
      "patient_healthcare_info_healthcare_provider_id_idx",
    ).on(patientHealthcareInfo.healthcareProviderID),
  }),
);
export const patienthealthcareInfoRelations = relations(
  patientHealthcareInfo,
  ({ one }) => ({
    patient: one(patient, {
      fields: [patientHealthcareInfo.patientID],
      references: [patient.id],
    }),
    doctor: one(doctor, {
      fields: [patientHealthcareInfo.doctorID],
      references: [doctor.id],
    }),
    healthCareProvider: one(externalHealthcareProvider, {
      fields: [patientHealthcareInfo.healthcareProviderID],
      references: [externalHealthcareProvider.id],
    }),
    healthInsurance: one(healthInsurance, {
      fields: [patientHealthcareInfo.healthInsuranceID],
      references: [healthInsurance.id],
    }),
  }),
);

// patient address
export const patientAddress = pgTable(
  "patient_address",
  {
    id: serial("id").primaryKey(),
    patientID: text("patient_id")
      .notNull()
      .references(() => patient.id, { onDelete: "cascade" }),
    address1: varchar("address1").notNull(),
    address2: varchar("address2"),
    city: varchar("city").notNull(),
    zipCode: varchar("zip_code").notNull(),
  },
  (patientAddress) => ({
    patientIDIdx: index("patient_address_patient_id_idx").on(
      patientAddress.patientID,
    ),
  }),
);
export const patientAddressRelations = relations(patientAddress, ({ one }) => ({
  patient: one(patient, {
    fields: [patientAddress.patientID],
    references: [patient.id],
  }),
}));
