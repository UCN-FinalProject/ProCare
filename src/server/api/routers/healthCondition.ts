import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import HealthConditionService from "~/server/service/HealthConditionService";
import { TRPCError } from "@trpc/server";
import {
  createHealthConditionInput,
  getManyHealthConditionsInput,
} from "~/server/service/validation/HealthConditionValidation";

export const healthConditionRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await HealthConditionService.getByID(input.id);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            error instanceof TRPCError
              ? error.message
              : error instanceof Error
              ? error.message
              : "Not found",
        });
      }
    }),

  getMany: publicProcedure
    .input(getManyHealthConditionsInput)
    .query(async ({ input }) => {
      try {
        return await HealthConditionService.getMany(input);
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            error instanceof TRPCError
              ? error.message
              : error instanceof Error
              ? error.message
              : "Not found",
        });
      }
    }),

  create: publicProcedure
    .input(createHealthConditionInput)
    .mutation(async ({ input }) => {
      try {
        return await HealthConditionService.create(input);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof TRPCError
              ? error.message
              : error instanceof Error
              ? error.message
              : "Bad request",
        });
      }
    }),

  update: publicProcedure
    .input(z.object({ id: z.number() }).merge(createHealthConditionInput))
    .mutation(async ({ input }) => {
      try {
        return await HealthConditionService.update(input);
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            error instanceof TRPCError
              ? error.message
              : error instanceof Error
              ? error.message
              : "Bad request",
        });
      }
    }),
});
