import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { parseErrorMessage } from "~/lib/parseError";
import {
  getManyProceduresInput,
  createProcedureInput,
  createProcedurePricingInput,
  updateProcedureInput,
  updateProcedurePricingInput,
} from "~/server/service/validation/ProcedureValidation";
import ProcedureService from "~/server/service/ProcedureService";

export const procedureRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ProcedureService.getByID({ id: input.id, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  getMany: protectedProcedure
    .input(getManyProceduresInput)
    .query(async ({ input, ctx }) => {
      try {
        return await ProcedureService.getMany({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        data: createProcedureInput,
        pricingInput: z.array(createProcedurePricingInput).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ProcedureService.create({
          input: input.data,
          pricingInput: input.pricingInput,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        data: updateProcedureInput,
        pricingInput: z.array(updateProcedurePricingInput).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        return await ProcedureService.update({
          input: input.data,
          pricingInput: input.pricingInput,
          ctx,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            error,
            defaultMessage: "Not found",
          }),
        });
      }
    }),
});
