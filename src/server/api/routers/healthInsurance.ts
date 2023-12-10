import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import HealthInsuranceService from "~/server/service/HealthInsuranceService";
import { z } from "zod";
import {
  createHealthInsuranceInput,
  getHealthInsurancesInput,
  updateHealthInsuranceInput,
} from "~/server/service/validation/HealthInsurance";

export const healthInsuranceRouter = createTRPCRouter({
  // GET (single)
  getByByID: protectedProcedure
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
  getMany: protectedProcedure
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
  create: adminProcedure
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
  update: adminProcedure
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
  setActive: adminProcedure
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
  setInactive: adminProcedure
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
