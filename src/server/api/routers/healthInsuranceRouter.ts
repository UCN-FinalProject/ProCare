import { TRPCError } from "@trpc/server";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import HealthInsuranceService from "~/server/service/HealthInsuranceService";
import { z } from "zod";
import {
  createHealthInsuranceInput,
  getHealthInsurancesInput,
  updateHealthInsuranceInput,
} from "~/server/service/validation/HealthInsuranceValidation";
import { parseErrorMessage } from "~/lib/parseError";

export const healthInsuranceRouter = createTRPCRouter({
  // GET (single)
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.getByID({
          id: input.id,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurance not found",
          }),
        });
      }
    }),

  // GET (multiple)
  getMany: protectedProcedure
    .input(getHealthInsurancesInput)
    .query(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.getMany({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurances not found",
          }),
        });
      }
    }),

  // POST (create)
  create: adminProcedure
    .input(createHealthInsuranceInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.create({
          input,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurance could not be created",
          }),
        });
      }
    }),

  // PUT (update)
  update: adminProcedure
    .input(updateHealthInsuranceInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.update({
          input,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurance could not be updated",
          }),
        });
      }
    }),

  // POST (set active)
  setActive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.setStatus({
          input: { id: input.id, isActive: true },
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurance could not be updated",
          }),
        });
      }
    }),

  // POST (set inactive)
  setInactive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthInsuranceService.setStatus({
          input: { id: input.id, isActive: false },
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            error,
            defaultMessage: "Health insurance could not be updated",
          }),
        });
      }
    }),
});
