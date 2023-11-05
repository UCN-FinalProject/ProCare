import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HealthInsuranceService from "~/server/service/HealthInsuranceService";
import { z } from "zod";
import {
  createHealthInsuranceInput,
  getHealthInsurancesInput,
  updateHealthInsuranceInput,
} from "~/server/service/validation/HealthInsurance";

export const healthInsuranceRouter = createTRPCRouter({
  // GET (single)
  getHealthInsuranceByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await HealthInsuranceService.getHealthInsuranceByID(input.id);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),

  // GET (multiple)
  getHealthInsurances: publicProcedure
    .input(getHealthInsurancesInput)
    .query(async ({ input }) => {
      try {
        return await HealthInsuranceService.getHealthInsurances(input);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),

  // POST (create)
  create: publicProcedure
    .input(createHealthInsuranceInput)
    .mutation(async ({ input }) => {
      try {
        return await HealthInsuranceService.createHealthInsurance({
          healthInsurance: input,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bad request",
          });
        }
      }
    }),

  // PUT (update)
  update: publicProcedure
    .input(updateHealthInsuranceInput)
    .mutation(async ({ input }) => {
      try {
        return await HealthInsuranceService.updateHealthInsurance(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bad request",
          });
        }
      }
    }),

  // POST (set active)
  setActive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await HealthInsuranceService.setActiveHealthInsurance(input.id);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bad request",
          });
        }
      }
    }),

  // POST (set inactive)
  setInactive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await HealthInsuranceService.setInactiveHealthInsurance(
          input.id,
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Bad request",
          });
        }
      }
    }),
});
