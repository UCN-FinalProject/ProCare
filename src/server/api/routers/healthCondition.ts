import { z } from "zod";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import HealthConditionService from "~/server/service/HealthConditionService";
import { TRPCError } from "@trpc/server";
import {
  createHealthConditionInput,
  getManyHealthConditionsInput,
} from "~/server/service/validation/HealthConditionValidation";
import { parseErrorMessage } from "~/lib/parseError";

export const healthConditionRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await HealthConditionService.getByID({ id: input.id, ctx });
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
    .input(getManyHealthConditionsInput)
    .query(async ({ input, ctx }) => {
      try {
        return await HealthConditionService.getMany({ input, ctx });
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

  create: adminProcedure
    .input(createHealthConditionInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthConditionService.create({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),

  update: adminProcedure
    .input(z.object({ id: z.number() }).merge(createHealthConditionInput))
    .mutation(async ({ input, ctx }) => {
      try {
        return await HealthConditionService.update({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: parseErrorMessage({
            error,
            defaultMessage: "Bad request",
          }),
        });
      }
    }),
});
