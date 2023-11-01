import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const tennant = pgTable("tennant", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  basis: decimal("basis").notNull(),
  regionalAuthority: varchar("regional_authority").notNull(),
});
export const tennantRelations = relations(tennant, ({ one }) => ({
  tennantVATRelations: one(tennantVAT),
  tennantBankDetailsRelations: one(tennantBankDetails),
  healthCareProviderRelations: one(healthCareProvider),
  headDoctorRelations: one(headDoctor),
}));

export const headDoctor = pgTable("head_doctor", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  headDoctor: varchar("head_doctor").notNull(),
  headDoctorID: varchar("head_doctor_id").notNull(),
});
export const headDoctorRelations = relations(headDoctor, ({ one }) => ({
  tennant: one(tennant),
}));

export const healthCareProvider = pgTable("health_care_provider", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  name: varchar("name").notNull(),
  address1: varchar("address1").notNull(),
  address2: varchar("address2"),
  city: varchar("city").notNull(),
  zip: varchar("zip").notNull(),
});
export const healthCareProviderRelations = relations(
  healthCareProvider,
  ({ one }) => ({
    tennant: one(tennant),
  }),
);

export const tennantVAT = pgTable("tennant_vat", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  VAT1: varchar("vat1").notNull(),
  VAT2: varchar("vat2").notNull(),
  VAT3: varchar("vat3"),
});
export const tennantVATRelations = relations(tennantVAT, ({ one }) => ({
  tennant: one(tennant),
}));

export const tennantBankDetails = pgTable("tennant_bank_details", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  bankName: varchar("bank_name").notNull(),
  SWIFT: varchar("bank_account_id").notNull(),
  IBAN: varchar("iban").notNull(),
});
export const tennantBankDetailsRelations = relations(
  tennantBankDetails,
  ({ one }) => ({
    tennant: one(tennant),
  }),
);
