import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const healthCondition = pgTable("health_condition", {
  id: serial("ID").primaryKey(),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
});
