import { pgTable, varchar, date, boolean, serial } from "drizzle-orm/pg-core";

export const externalhHealthcareProvider = pgTable(
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
    dateFrom: date("date_from"),
    dateUntil: date("date_until"),
    note: varchar("note"),
    isActive: boolean("isActive").default(true),
  },
);
