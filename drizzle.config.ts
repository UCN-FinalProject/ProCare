import "dotenv/config";
import { type Config } from "drizzle-kit";
import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/export.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
    ssl: true,
  },
  breakpoints: true,
} satisfies Config;
