import { z } from "zod";
import ExternalHealthcareService from "~/server/service/HealthcareProviderService";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createHealthCareProviderInput,
  getManyHealthCareProvidersInput,
  updateHealthCareProviderInput,
  addDoctorInput,
  removeDoctorInput,
} from "~/server/service/validation/HealthCareProviderValidation";

export const healthcareProviderRouter = createTRPCRouter({
  getByID: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await ExternalHealthcareService.getByID(input.id);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  getMany: publicProcedure
    .input(getManyHealthCareProvidersInput)
    .query(async ({ input }) => {
      try {
        return await ExternalHealthcareService.getMany(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  create: publicProcedure
    .input(createHealthCareProviderInput)
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.create(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  update: publicProcedure
    .input(updateHealthCareProviderInput)
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.update(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  setActive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.setStatus({
          id: input.id,
          isActive: true,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  setInactive: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.setStatus({
          id: input.id,
          isActive: false,
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  getDoctors: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        return await ExternalHealthcareService.getDoctors(input.id);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  addDoctor: publicProcedure
    .input(addDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.addDoctor(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  removeDoctor: publicProcedure
    .input(removeDoctorInput)
    .mutation(async ({ input }) => {
      try {
        return await ExternalHealthcareService.removeDoctor(input);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: error.code,
            message: error.message,
          });
        } else {
          throw new TRPCError({
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),
});
