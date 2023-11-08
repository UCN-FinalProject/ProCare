import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "~/server/api/routers/webauthn";
import { createTRPCRouter } from "~/server/api/trpc";
import { healthcareProviderRouter } from "~/server/api/routers/healthcareProviderRouter";

import { tennantRouter } from "./routers/tennant";
import { healthInsuranceRouter } from "./routers/healthInsurance";
import { healthConditionRouter } from "./routers/healthCondition";
import { doctorRouter } from "./routers/doctorRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  example: exampleRouter,
  tennant: tennantRouter,
  healthcareProvider: healthcareProviderRouter,
  healthInsurance: healthInsuranceRouter,
  healthCondition: healthConditionRouter,
  doctor: doctorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
