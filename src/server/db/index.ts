import { drizzle } from "drizzle-orm/neon-serverless";
// import postgres from "postgres";
import { env } from "~/env.mjs";
import * as schema from "./export";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;
const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });
