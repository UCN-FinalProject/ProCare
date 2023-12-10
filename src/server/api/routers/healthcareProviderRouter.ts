import { z } from "zod";
import ExternalHealthcareService from "~/server/service/HealthcareProviderService";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createHealthCareProviderInput,
  getManyHealthCareProvidersInput,
  updateHealthCareProviderInput,
  addDoctorInput,
  removeDoctorInput,
} from "~/server/service/validation/HealthCareProviderValidation";

export const healthcareProviderRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.getByID({ id: input.id, ctx });
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

  getMany: protectedProcedure
    .input(getManyHealthCareProvidersInput)
    .query(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.getMany({ input, ctx });
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

  create: adminProcedure
    .input(createHealthCareProviderInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.create({ input, ctx });
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

  update: adminProcedure
    .input(updateHealthCareProviderInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.update({ input, ctx });
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

  setActive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.setStatus({
          input: {
            id: input.id,
            isActive: true,
          },
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
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  setInactive: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.setStatus({
          input: {
            id: input.id,
            isActive: false,
          },
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
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  getDoctors: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.getDoctors({
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
            message: error instanceof Error ? error.message : "Not Found",
            code: "NOT_FOUND",
          });
        }
      }
    }),

  addDoctor: adminProcedure
    .input(addDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.addDoctor({ input, ctx });
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

  removeDoctor: adminProcedure
    .input(removeDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.removeDoctor({ input, ctx });
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
