import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { doctor } from "./doctor";
import { relations } from "drizzle-orm";

export const tennant = pgTable("tennant", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  basis: decimal("basis").notNull(),

  pzsName: varchar("pzs_name").notNull(),
  regionalAuthority: varchar("regional_authority").notNull(),

  pzsID: integer("pzs_id").notNull(),
  doctorID: integer("doctor_id")
    .notNull()
    .references(() => doctor.id),
  pzsAddress1: varchar("pzs_address1").notNull(),
  pzsAddress2: varchar("pzs_address2"),
  pzsCity: varchar("pzs_city").notNull(),
  pzsZip: varchar("pzs_zip").notNull(),
});
export const tennantRelations = relations(tennant, ({ one }) => ({
  doctor: one(doctor),
  tennantVATRelations: one(tennantVAT),
  tennantBankDetailsRelations: one(tennantBankDetails),
}));

export const tennantVAT = pgTable("tennant_vat", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  vat1: varchar("vat1").notNull(),
  vat2: varchar("vat2").notNull(),
  vat3: varchar("vat3"),
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
