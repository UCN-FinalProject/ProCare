import TennantService from "~/server/service/TennantService";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { tennantInput } from "~/server/service/validation";

export const tennantRouter = createTRPCRouter({
  // GET
  getTennant: publicProcedure.query(async () => {
    try {
      return await TennantService.getTennant();
    } catch (error) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: error instanceof Error ? error.message : "Not found",
      });
    }
  }),

  // POST (CREATE)
  createTennant: publicProcedure
    .input(tennantInput)
    .mutation(async ({ input }) => {
      try {
        return await TennantService.createTennant({ tennant: input });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),

  // UPDATE
  updateTenant: publicProcedure
    .input(tennantInput)
    .mutation(async ({ input }) => {
      try {
        return await TennantService.updateTennant({ tennant: input });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error instanceof Error ? error.message : "Not found",
        });
      }
    }),
});
