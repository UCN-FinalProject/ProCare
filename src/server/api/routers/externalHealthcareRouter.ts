import { z } from "zod";
import ExternalHealthcareService from "~/server/service/ExternalHealthcareService";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const healthcareProviderRouter = createTRPCRouter({
  getByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await ExternalHealthcareService.getHealthCareProviderByID({
          id: input.id,
        });
      } catch (error) {
        throw new TRPCError({
          message: error instanceof Error ? error.message : "Not Found",
          code: "NOT_FOUND",
        });
      }
    }),
});
