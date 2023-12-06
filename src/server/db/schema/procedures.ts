import { relations } from "drizzle-orm";
import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";
import { healthInsurance } from "../export";

export const procedures = pgTable("procedures", {
  id: serial("ID").primaryKey(),
  name: varchar("name").notNull(),
});
export const proceduresRelations = relations(procedures, ({ many }) => ({
  procedurePricing: many(procedurePricing),
}));

export type Procedure = typeof procedures.$inferSelect;

export const procedurePricing = pgTable("procedure_pricing", {
  id: serial("ID").primaryKey(),
  procedureId: integer("procedure_id")
    .notNull()
    .references(() => procedures.id),
  healthInsuranceId: integer("health_insurance_id")
    .notNull()
    .references(() => healthInsurance.id),
  credits: integer("credits").notNull(),
  price: numeric("price").notNull(),
});
export const procedurePricingRelations = relations(
  procedurePricing,
  ({ one }) => ({
    procedure: one(procedures, {
      fields: [procedurePricing.procedureId],
      references: [procedures.id],
    }),
    healthInsurance: one(healthInsurance, {
      fields: [procedurePricing.healthInsuranceId],
      references: [healthInsurance.id],
    }),
  }),
);
export type ProcedurePricing = typeof procedurePricing.$inferSelect;
