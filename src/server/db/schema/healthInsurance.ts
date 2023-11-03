import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// healthinsurance table & relations
export const healthInsurance = pgTable("health_insurance", {
  id: serial("id").primaryKey(),
  insuranceID: integer("insurance_id").unique().notNull(),
  registeredID: integer("registered_id").unique().notNull(),
  name: varchar("name").notNull(),
  pricePerCredit: decimal("price_per_credit").notNull(),
});
export const HealthInsuranceRelations = relations(
  healthInsurance,
  ({ one }) => ({
    healthInsuranceAddress: one(healthInsuranceAddress, {
      fields: [healthInsurance.id],
      references: [healthInsuranceAddress.insuranceID],
    }),
    healthInsuranceVAT: one(healthInsuranceVAT, {
      fields: [healthInsurance.id],
      references: [healthInsuranceVAT.insuranceID],
    }),
  }),
);

// healthinsurance address table & relations
export const healthInsuranceAddress = pgTable("health_insurance_address", {
  id: serial("id").primaryKey(),
  insuranceID: integer("insurance_id")
    .notNull()
    .references(() => healthInsurance.id),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  zip: varchar("zip").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
});
export const tennantVAT = relations(healthInsuranceAddress, ({ one }) => ({
  healthInsurance: one(healthInsurance, {
    fields: [healthInsuranceAddress.insuranceID],
    references: [healthInsurance.id],
  }),
}));

// healthinsurance VAT table & relations
export const healthInsuranceVAT = pgTable("health_insurance_vat", {
  id: serial("id").primaryKey(),
  insuranceID: integer("insurance_id")
    .notNull()
    .references(() => healthInsurance.id),
  vat1: varchar("vat1").notNull(),
  vat2: varchar("vat2").notNull(),
  vat3: varchar("vat3"),
});
export const HealthInsuranceVATRelations = relations(
  healthInsuranceVAT,
  ({ one }) => ({
    healthInsurance: one(healthInsurance, {
      fields: [healthInsuranceVAT.insuranceID],
      references: [healthInsurance.id],
    }),
  }),
);
