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
import { parseErrorMessage } from "~/lib/parseError";

export const healthcareProviderRouter = createTRPCRouter({
  getByID: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.getByID({ id: input.id, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            defaultMessage: "Not Found.",
            error,
          }),
        });
      }
    }),

  getMany: protectedProcedure
    .input(getManyHealthCareProvidersInput)
    .query(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.getMany({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            defaultMessage: "Not Found.",
            error,
          }),
        });
      }
    }),

  create: adminProcedure
    .input(createHealthCareProviderInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.create({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not create healthcare provider.",
            error,
          }),
        });
      }
    }),

  update: adminProcedure
    .input(updateHealthCareProviderInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.update({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not update healthcare provider.",
            error,
          }),
        });
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not activate healthcare provider.",
            error,
          }),
        });
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not deactivate healthcare provider.",
            error,
          }),
        });
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
        throw new TRPCError({
          code: "NOT_FOUND",
          message: parseErrorMessage({
            defaultMessage: "Not Found.",
            error,
          }),
        });
      }
    }),

  addDoctor: adminProcedure
    .input(addDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.addDoctor({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not add doctor.",
            error,
          }),
        });
      }
    }),

  removeDoctor: adminProcedure
    .input(removeDoctorInput)
    .mutation(async ({ input, ctx }) => {
      try {
        return await ExternalHealthcareService.removeDoctor({ input, ctx });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: parseErrorMessage({
            defaultMessage: "Could not remove doctor.",
            error,
          }),
        });
      }
    }),
});
