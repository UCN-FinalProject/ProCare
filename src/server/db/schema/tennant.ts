import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// tennant table & tennant relations
export const tennant = pgTable("tennant", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  basis: decimal("basis").notNull(),
  regionalAuthority: varchar("regional_authority").notNull(),
});
export const tennantRelations = relations(tennant, ({ one }) => ({
  headDoctor: one(headDoctor, {
    fields: [tennant.id],
    references: [headDoctor.tennantID],
  }),
  healthCareProvider: one(healthCareProvider, {
    fields: [tennant.id],
    references: [healthCareProvider.tennantID],
  }),
  tennantBankDetails: one(tennantBankDetails, {
    fields: [tennant.id],
    references: [tennantBankDetails.tennantID],
  }),
  tennantVAT: one(tennantVAT, {
    fields: [tennant.id],
    references: [tennantVAT.tennantID],
  }),
}));
// tennant type
export type Tennant = typeof tennant.$inferSelect & {
  headDoctor: typeof headDoctor.$inferSelect;
  healthCareProvider: typeof healthCareProvider.$inferSelect;
  tennantBankDetails: typeof tennantBankDetails.$inferSelect;
  tennantVAT: typeof tennantVAT.$inferSelect;
};

// HeadDoctor table & HeadDoctor relations
export const headDoctor = pgTable("head_doctor", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  headDoctor: varchar("head_doctor").notNull(),
  headDoctorID: varchar("head_doctor_id").notNull(),
});
export const headDoctorRelations = relations(headDoctor, ({ one }) => ({
  tennant: one(tennant, {
    fields: [headDoctor.tennantID],
    references: [tennant.id],
  }),
}));

// (internal) HealthCareProvider table & HealthCareProvider relations
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
    tennant: one(tennant, {
      fields: [healthCareProvider.tennantID],
      references: [tennant.id],
    }),
  }),
);

// TennantVAT table & TennantVAT relations
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
  tennant: one(tennant, {
    fields: [tennantVAT.tennantID],
    references: [tennant.id],
  }),
}));

// TennantBankDetails table & TennantBankDetails relations
export const tennantBankDetails = pgTable("tennant_bank_details", {
  id: serial("id").primaryKey(),
  tennantID: integer("tennant_id")
    .notNull()
    .references(() => tennant.id),
  bankName: varchar("bank_name").notNull(),
  SWIFT: varchar("swift").notNull(),
  IBAN: varchar("iban").notNull(),
});
export const tennantBankDetailsRelations = relations(
  tennantBankDetails,
  ({ one }) => ({
    tennant: one(tennant, {
      fields: [tennantBankDetails.tennantID],
      references: [tennant.id],
    }),
  }),
);
