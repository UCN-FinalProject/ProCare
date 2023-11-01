import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const doctor = pgTable("doctor", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});
