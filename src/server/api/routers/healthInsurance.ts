import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import HealthInsuranceService from "~/server/service/HealthInsuranceService";
import { z } from "zod";
import {
  createHealthInsuranceInput,
  getHealthInsurancesInput,
  updateHealthInsuranceInput,
} from "~/server/service/validation/HealthInsurance";

export const healthInsuranceRouter = createTRPCRouter({
  // GET (single)
  getHealthInsuranceByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.getHealthInsuranceByID({
          id: input.id,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),

  // GET (multiple)
  getHealthInsurances: protectedProcedure
    .input(getHealthInsurancesInput)
    .query(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.getHealthInsurances({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),

  // POST (create)
  create: protectedProcedure
    .input(createHealthInsuranceInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.createHealthInsurance({
          input,
          ctx,
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
  update: protectedProcedure
    .input(updateHealthInsuranceInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.updateHealthInsurance({
          input,
          ctx,
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

  // POST (set active)
  setActive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.setActiveHealthInsurance({
          id: input.id,
          ctx,
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

  // POST (set inactive)
  setInactive: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.setInactiveHealthInsurance({
          id: input.id,
          ctx,
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
});