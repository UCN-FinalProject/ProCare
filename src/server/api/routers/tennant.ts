import TennantService from "~/server/service/TennantService";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { tennantInput } from "~/server/service/validation/TennantValidation";
import { parseErrorMessage } from "~/lib/parseError";

export const tennantRouter = createTRPCRouter({
  // GET
  getTennant: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await TennantService.getTennant({ ctx });
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: parseErrorMessage({ error, defaultMessage: "Not found" }),
      });
    }
  }),

  // POST (CREATE)
  createTennant: protectedProcedure
    .input(tennantInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await TennantService.createTennant({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({ error, defaultMessage: "Not found" }),
        });
      }
    }),

  // UPDATE
  updateTenant: protectedProcedure
    .input(tennantInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await TennantService.updateTennant({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({ error, defaultMessage: "Not found" }),
        });
      }
    }),
});