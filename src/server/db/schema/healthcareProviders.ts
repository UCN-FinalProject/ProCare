import {
    integer,
    pgTable,
    varchar,
    date,
    boolean,
  } from "drizzle-orm/pg-core";

  export const external_healthcare_provider = pgTable("external_healthcare_provider", {
    name: varchar("name").notNull(),
    healthcare_provider_code: varchar("name").notNull(),
    vat_number: varchar("vat_number").notNull(),
    address_main: varchar("address_main").notNull(),
    address_secondary: varchar("address_secondary"),
    cite: varchar("city").notNull(),
    zip_code: integer("zip_code").notNull(),
    date_from: date("date_from"),
    date_until: date("date_until"),
    note: varchar("note"),
    isActive: boolean("isActive").default(true)
  })