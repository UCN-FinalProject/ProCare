import {
  pgTable,
  varchar,
  boolean,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";

export const externalHealthcareProvider = pgTable(
  "external_healthcare_provider",
  {
    id: serial("ID").primaryKey(),
    name: varchar("name").notNull(),
    healthcareProviderCode: varchar("healthcare_provider_code").notNull(),
    VAT: varchar("vat").notNull(),
    address1: varchar("address1").notNull(),
    address2: varchar("address2"),
    city: varchar("city").notNull(),
    zip: varchar("zip").notNull(),
    note: varchar("note"),
    isActive: boolean("isActive").default(true),
  },
);
export const healthCareProviderRelation = relations(
  externalHealthcareProvider,
  ({ many }) => ({
    doctors: many(healthcareProviderDoctors),
  }),
);

export const healthcareProviderDoctors = pgTable(
  "healthcare_provider_doctors",
  {
    id: serial("ID").primaryKey(),
    healthcareProviderID: integer("healthcare_provider_id")
      .notNull()
      .references(() => externalHealthcareProvider.id),
    doctorID: integer("doctor_id")
      .notNull()
      .references(() => doctor.id),
  },
);
export const externalHealthcareProviderDoctorRelation = relations(
  healthcareProviderDoctors,
  ({ one }) => ({
    doctors: one(doctor, {
      fields: [healthcareProviderDoctors.doctorID],
      references: [doctor.id],
    }),
    healthcareProviders: one(externalHealthcareProvider, {
      fields: [healthcareProviderDoctors.healthcareProviderID],
      references: [externalHealthcareProvider.id],
    }),
  }),
);
