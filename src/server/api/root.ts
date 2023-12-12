import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "~/server/api/routers/authRouter";
import { createTRPCRouter } from "~/server/api/trpc";
import { healthcareProviderRouter } from "~/server/api/routers/healthcareProviderRouter";

import { tennantRouter } from "./routers/tennant";
import { healthInsuranceRouter } from "./routers/healthInsuranceRouter";
import { healthConditionRouter } from "./routers/healthCondition";
import { doctorRouter } from "./routers/doctorRouter";
import { userRouter } from "./routers/userRouter";
import { patientRouter } from "./routers/PatientRouter";
import { procedureRouter } from "./routers/procedureRouter";

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
  user: userRouter,
  patient: patientRouter,
  procedure: procedureRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
